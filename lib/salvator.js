var assert = require("assert");
var fs = require("fs");
var path = require("path");

function during(test, iterator, callback) {
    return function loop() {
        var args = Array.prototype.slice.call(arguments);

        test.apply(null, [ function(err, passed) {
            if (err) {
                return callback(err);
            }

            if (!passed) {
                return callback.apply(null, [ void 0 ].concat(args));
            }

            iterator.apply(null, [ function(err) {
                var args;

                if (err) {
                    return callback(err);
                }

                args = Array.prototype.slice.call(arguments, 1);

                loop.apply(null, args);
            } ].concat(args));

        } ].concat(args));
    };
}

function template(str) {
    return function(data) {
        return str.replace(/\$\{([a-z]+[0-9a-z_$]*)\}/ig, function(str, key) {
            return data[key];
        });
    };
};

function getBump(filepath, format) {
    var dirname, filename, extname, tpl;

    tpl = template(format);

    dirname  = path.dirname(filepath);
    filename = path.basename(filepath).split('.').slice(0, -1).join('.');
    extname  = path.extname(filepath).substr(1);

    return function(filepath, fix, callback) {
        try {
            callback(null, tpl({
                dirname:  dirname,
                filename: filename,
                extname:  extname,
                fix:      fix
            }));
        } catch (err) {
            callback(err);
        }
    };
}

module.exports = function(filepath, options) {
    var counter, format, limit, bump;

    assert(typeof filepath == "string", "String is expected");

    options = options || {};
    counter = options.counter || function(fix) {  return fix == void 0 ? 1 : ++fix; };
    format  = options.format || "${dirname}/${filename}(${fix}).${extname}";
    limit   = options.limit || 999;

    bump = getBump(filepath, format);

    return new Promise(function(resolve, reject) {
        var count = 0;

        var loop = during(
            // test
            function(next, filepath) {
                if (++count > limit) {
                    return next(new Error("Limit exceeded"));
                }
                console.log('try', filepath);
                fs.exists(filepath, function(exists) {
                    next(null, exists);
                });
            },
            // iterator
            function(next, filepath, fix) {
                fix = counter(fix);

                console.log('fix', fix);

                bump(filepath, fix, function(err, bumpedPath) {
                    if (err) {
                        return next(err);
                    }

                    next(null, bumpedPath, fix);
                });
            },
            // callback
            function(err, result) {
                if (err) {
                    return reject(err);
                }

                resolve(result);
            }
        );

        loop(filepath);
    });
};
