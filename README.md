grunt-map2map
=============

Map one source map to another source map.
Why would you want this? Lets say...

- Compile some Typescript to JavaScript and generate a source map
- Run compiled JavaScript through Closure Compiler and generate another source map
- Remap the source map for the obfuscated code back to the original Typescript

## Install

```shell
npm install grunt-map2map --save-dev
```

## Example

```javascript
grunt.initConfig({
	map2map: {
		main: {
			generated: 'bin/main.obfuscated.js.map', // obfuscated source map
			original: 'bin/main.compiled.js.map',    // compiled/concat source map
			dest: 'bin/main.final.js.map'            // where to write remapped file
		}
	}
});
```
