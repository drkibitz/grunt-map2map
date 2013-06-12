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

    var sm = require('source-map');

    grunt.registerMultiTask('map2map', function () {

        var config        = grunt.config(this.name)[this.target];
        var generatedPath = grunt.template.process(config.generated);
        var originalPath  = grunt.template.process(config.original);
        var destPath      = grunt.template.process(config.dest);

        var consumerGen   = new sm.SourceMapConsumer(grunt.file.readJSON(generatedPath));
        var consumerOrig  = new sm.SourceMapConsumer(grunt.file.readJSON(originalPath));

        var smg = new sm.SourceMapGenerator({
            file: consumerGen.file,
            sourceRoot: consumerOrig.sourceRoot
        });

        consumerGen.eachMapping(function (nodeGen) {
            var nodeOrig = consumerOrig.originalPositionFor({line: nodeGen.originalLine, column: nodeGen.originalColumn});
            var generated = {line: nodeGen.generatedLine, column: nodeGen.generatedColumn};
            var original = {line: nodeOrig.line, column: nodeOrig.column};
            if (nodeOrig.source !== null) {
                smg.addMapping({
                    generated: generated,
                    original: original,
                    source: nodeOrig.source,
                    name: nodeOrig.name
                });
            }
        });
        grunt.file.write(destPath || generatedPath, smg.toString());
    });
};
