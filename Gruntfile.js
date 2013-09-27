/*
 * grunt-init-porpentine
 * https://github.com/jrm/grunt-init-porpentine
 *
 * Copyright (c) 2013 James Meldrum
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    default : {
      details : {
        version : '0.0.1',
        maintainer : 'James Meldrum (jrm.general@gmail.com)',
        description : 'Porpentine is here',
        site : 'http://github.com/JamesMeldrum/grunt-init-porpentine'
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    init_porpentine: {
      default_options: {
        options: {
        },
        files: {
          'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123'],
        },
      },
      custom_options: {
        options: {
          separator: ': ',
          punctuation: ' !!!',
        },
        files: {
          'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123'],
        },
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  //grunt.registerTask('test', ['clean', 'init_porpentine', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerMultiTask('default','Default message',function(){
  
    grunt.log.writeln( this.target.description  );
    grunt.log.writeln( 'Version:', this.target.version );
    grunt.log.writeln( 'Maintainer: ', this.target.version );
    grunt.log.writeln( 'Site:', this.target.site );

  });

};
