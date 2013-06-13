/*
 * grunt-map2map
 * http://drkibitz.com/
 *
 * Copyright (c) 2013 Dr. Kibitz
 * Licensed under the MIT license.
 * http://opensource.org/licenses/MIT
 */

module.exports = function (grunt) {
    "use strict";

    var path = require('path');
    var sm = require('source-map');

    function appendSourceMappingURL(sourcePath, url) {
        var contents = grunt.file.read(sourcePath);
        grunt.log.writeln('Appending sourceMappingURL: ' + url.cyan);
        contents += "/*\n//@ sourceMappingURL=" + url + "\n*/";
        grunt.file.write(sourcePath, contents);
    }

    grunt.registerMultiTask('map2map', function () {

        var options       = this.options();
        var generatedPath = path.resolve(options.generated);
        var originalPath  = path.resolve(options.original);
        var destPath      = options.dest ? path.resolve(options.dest) : generatedPath;

        var genConsumer   = new sm.SourceMapConsumer(grunt.file.readJSON(generatedPath));
        var origConsumer  = new sm.SourceMapConsumer(grunt.file.readJSON(originalPath));
        var sourcePath    = path.resolve(genConsumer.file);

        var smg = new sm.SourceMapGenerator({
            file: path.relative(path.dirname(sourcePath), sourcePath),
            sourceRoot: origConsumer.sourceRoot
        });

        // Remap generated's original, to the original's original
        genConsumer.eachMapping(function (genPos) {
            var origPos = origConsumer.originalPositionFor({line: genPos.originalLine, column: genPos.originalColumn});
            var mapping = {
                generated: {line: genPos.generatedLine, column: genPos.generatedColumn},
                original: {line: origPos.line, column: origPos.column},
                source: origPos.source,
                name: origPos.name
            };
            // Wrap in try catch simply because some
            // source map implementations are broken.
            // e.g. Closure Compiler with ADVANCED_OPTIMIZATIONS
            try {
                smg.addMapping(mapping);
            } catch (err) {
                grunt.log.warn(grunt.util.error(err), mapping);
            }
        });

        // Write source map
        grunt.file.write(destPath, smg.toString());

        // append sourceMappingURL
        if (options.sourceMappingURL) {
            appendSourceMappingURL(sourcePath, options.sourceMappingURL);
        }
    });
};
