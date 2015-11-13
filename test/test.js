var assert = require('assert');
var expect = require('chai').expect;
var sinon = require('sinon');
var cuculus = require('cuculus');
var path = require('path');

describe('salvator', function () {
	var fs, salvator;

	beforeEach(function() {
		cuculus.replace('fs', (fs = {}));
		salvator = require('../lib/salvator');
	});

	afterEach(function() {
		fs = {};

		cuculus.drop(path.resolve(__dirname, '../lib/salvator'));
		cuculus.drop('fs');
	});

	it('should return promise', function() {
		// prepare
		fs.stat = function noop(){};

		// when
		var result = salvator('aaa');

		// then
		expect(result).to.be.instanceof(Promise);
	});

	it('should check existance of file', function (done) {
		var path, initialPath, count, stat;

		// before
		count = 0;

		fs.stat = (stat = sinon.spy(function(path, callback) {
			if (count == 2) {
				return callback(true);
			}

			count++;
			callback(false);
		}));

		// when
		path = salvator((initialPath = "/path/to/abc.js"), {
			counter: function(current) {
				return current == void 0 ? 1 : ++current;
			},
			format: "${dirname}/${filename}(${fix}).${extname}"
		});

		// then
		path
			.then(function(result) {
				expect(stat.callCount).equal(3);
				// expect(stat.calledWithExactly(initialPath)).to.be.true;
				expect(result).equal("/path/to/abc(2).js");
			})
			.then(done, done);
	});
});
