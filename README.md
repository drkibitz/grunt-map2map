grunt-map2map
=============

Map one source map to another source map.
Why would you want this? Lets say...

- Compile some Typescript to JavaScript and generate a source map
- Run compiled JavaScript through Closure Compiler and generate another source map
- Remap the source map for the obfuscated code back to the original Typescript

**NOTE:** This module does not fix any of the problems with source maps generated along with Closure Compiler's `ADVANCED_OPTIMIZATIONS`.

## Install

```shell
npm install grunt-map2map --save-dev
```

## Example

```javascript
grunt.initConfig({
	map2map: {
		options: {
			autoSourceMappingURL: true                   // find/replace/append sourceMappingURL
		},
		main: {
			options: {
				generated: 'bin/main.obfuscated.js.map', // obfuscated/minified source map
				original: 'bin/main.compiled.js.map',    // compiled/concat source map
				dest: 'bin/main.final.js.map',           // where to write remapped file
			}
		}
	}
});
```
