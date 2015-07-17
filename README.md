#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> Checks given filepath to exist, and if yes, returns safe version of filepath


## Install

```sh
$ npm install --save salvator
```


## Usage

```js
var salvator = require('salvator');

salvator('/path/to/my/file.js')
    .then(function(result) {
        // result is a safe to write filepath like a
        // /path/to/my/file(1).js
    });
```


## API

##### salvator(filepath: string[, options: Object]) : Promise

###### options.format
Type: `string`
Default: `"${dirname}/${filename}(${fix}).${extname}"`

Template for a new path iterator.

###### options.counter
Type: `Function(fix: Any)`
Default: `[incremental function]`

Where `fix` is a result from previous call, or `undefined`.

###### options.limit
Type: `number`
Default: `999`

Limit of iterations.


## License

MIT © [Sergey Kamrdin](https://github.com/gobwas)


[npm-image]: https://badge.fury.io/js/salvator.svg
[npm-url]: https://npmjs.org/package/salvator
[travis-image]: https://travis-ci.org/gobwas/salvator.svg?branch=master
[travis-url]: https://travis-ci.org/gobwas/salvator
[daviddm-image]: https://david-dm.org/gobwas/salvator.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/gobwas/salvator
