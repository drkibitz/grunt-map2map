grunt-map2map
=============

Map one source map to another source map. Why would you want this? Lets say...

- Compile some Typescript to JavaScript and generate a source map
- Run compiled JavaScript through Closure Compiler and generate another source map
- Remap the source map for the obfuscated code back to the original Typescript

## Before Use

- [grunt-contrib-uglify](https://github.com/gruntjs/grunt-contrib-uglify) already accomplishes this with its [sourceMapIn](https://github.com/gruntjs/grunt-contrib-uglify#sourcemapin) option. Only use this task for cases that do not already have this functionality.
- This module does not fix any of the problems with source maps generated along with Closure Compiler's `ADVANCED_OPTIMIZATIONS`. With this option, Closure Compiler can rewrite source so far beyond the original version, that mapping becomes virtually impossible.

## Install

```shell
npm install grunt-map2map --save-dev
```

## Options

- **sourceMappingURL**: `string` Value to append as sourceMappingURL to generated source file
- **generated**: `string` The location of the source map to remap to `original`
- **original**: `string` The location of the source map that `generated` will remap to
- **dest**: `string` The location to save the remapped source map, defaults to `generated`

## Example

```javascript
grunt.initConfig({
	map2map: {
		options: {
			sourceMappingURL: 'main.final.js.map'
		},
		main: {
			options: {
				generated: 'bin/main.obfuscated.js.map',
				original: 'bin/main.compiled.js.map',
				dest: 'bin/main.final.js.map'
			}
		}
	}
});
```


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/drkibitz/grunt-map2map/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

