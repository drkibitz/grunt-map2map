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

    grunt.registerMultiTask('map2map', function () {

        var config        = grunt.config(this.name)[this.target];
        var generatedPath = path.resolve(grunt.template.process(config.generated));
        var originalPath  = path.resolve(grunt.template.process(config.original));
        var destPath      = path.resolve(grunt.template.process(config.dest));

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
        grunt.file.write(destPath || generatedPath, smg.toString());

        var hasMappingURL = false;
        var write = false;
        var url = path.relative(path.dirname(sourcePath), destPath);

        if (!config.autoSourceMappingURL) return;

        // First try to find and replace current sourceMappingURL
        var contents = grunt.file.read(sourcePath)
            .replace(/(\/\/\@ sourceMappingURL\=)([\s\S]+)/g, function (a, $1, $2) {
                hasMappingURL = true;
                if ($2 !== url) {
                    write = true;
                    grunt.log.writeln('Replacing sourceMappingURL: ' + $2.cyan + ', with: ' + url.cyan);
                    return $1.trim() + url + "\n";
                }
                grunt.log.writeln('Found sourceMappingURL: ' + $2.cyan);
                return a;
            });

        // Found no sourceMappingURL, so append one now
        if (!hasMappingURL) {
            write = true;
            grunt.log.writeln('Appending sourceMappingURL: ' + url.cyan);
            contents += "//@ sourceMappingURL=" + url + "\n";
        }

        // Write source
        if (write)
            grunt.file.write(sourcePath, contents);
    });
};
