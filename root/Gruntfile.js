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
    pkg : grunt.file.readJSON( 'package.json' ),
    default : {
      porpentine : {
        deploy      : {},
        watch       : {},
        serve       : {},
        test        : {},
        name        : '<%= pkg.name %>',
        version     : '<%= pkg.version %>',
        maintainer  : '<%= pkg.author.name %> (<%= pkg.author.url %>)',
        description : '<%= pkg.description %>',
        url         : '<%= pkg.url %>'
      },
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

    // Register deps
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
    nodeunit: {
      tests: ['test/*_test.js'],
    },
    // Concatenate the files and add banners.
    concat: {
      options: {
        banner: '/*!\n' +
          ' * <%= pkg.title %> v<%= pkg.version %>, <%= grunt.template.today("yyyy-mm-dd") %>\n' +
          ' *\n' +
          ' * Hosted on <%= pkg.homepage %>\n' +
          ' * Copyright (c) <%= pkg.author.name %> (<%= pkg.author.url %>)\n' +
          ' * Licensed under <%= pkg.licenses[ 0 ].type %> license.\n' +
          ' */\n\n'
        },
        amd : {
          src: "tmp/**/*.amd.js",
          dest: "media/{%= name %}.amd.js"
        },
        css : {
          src : '_scripts/css/**/*.css',
          dest : '_scripts/css/main.css'
        },
        porpentine: {
          src: '_scripts/js/**/*.js',
          dest: 'media/js/main.js'
        }
    },
    // Watch the project files.
    watch: {
      lib: {
        files: ['*','!_site','!media'],
        tasks: [ 'css''jekyll' ]
      }
    }
    // Lint the build files.
    jshint: {
      options : {
       jshintrc : '.jshintrc'
      },
      porpentine : {
        src : [ '_scripts/js/**/*.js' ]
      },
    },
    cssmin : {
      porpentine : {
        options : {
          yuicompress : true,
          report : true
        },
        files : {
          'media/css/main.css' : '_scripts/css/*.css'
        }
      }
    }
    jekyll : {
      porpentine : {
        config : '_config.yml'
      }
    },
    transpile: {
      amd: {
        type: 'amd',
        files: [{
          expand: true,
          cwd: '_scripts/js/',
          src: ['**/*.js'],
          dest: 'tmp/',
          ext: '.amd.js'
        }]
      },
      commonjs: {
        type: 'cjs',
        files: [{
          expand: true,
          cwd: '_scripts/js/',
          src: ['{%= name %}/*.js'],
          dest: 'media/js/commonjs/',
          ext: '.js'
        },
        {
          src: ['_scripts/js/{%= name %}.js'],
          dest: 'media/js/commonjs/main.js'
        }]
      }
    },
    less : {
      porpentine : {
        files : {
          '_scripts/css/{%= name %}.css' : '_scripts/less/*.less'
        }
      }
    },
    browser: {
      porpentine : {
        src: ["vendor/loader.js", "media/js/amd/{%= name %}.amd.js"],
        dest: "media/js/main.js",
        options: {
          barename: "{%= name %}",
          namespace: "{%= namespace %}"
        }
      }
    }
  });

  grunt.registerMultiTask('browser', "Export a module to the window", function() {
    var opts = this.options();
    this.files.forEach(function(f) {
        var output = ["(function(globals) {"];

        output.push.apply(output, f.src.map(grunt.file.read));

        output.push(grunt.template.process('window.<%= namespace %> = requireModule("<%= barename %>");', {
            data: {
                namespace: opts.namespace,
                barename: opts.barename
            }
        }));
        output.push('})(window);');

        grunt.file.write(f.dest, grunt.template.process(output.join("\n")));
    });


  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks( 'grunt-contrib-jshint' )
  grunt.loadNpmTasks( 'grunt-contrib-clean' )
  grunt.loadNpmTasks( 'grunt-contrib-nodeunit' )
  grunt.loadNpmTasks( 'grunt-contrib-concat' )
  grunt.loadNpmTasks( 'grunt-contrib-watch' )
  grunt.loadNpmTasks( 'grunt-contrib-jshint' )
  grunt.loadNpmTasks( 'grunt-css' )
  grunt.loadNpmTasks( 'grunt-jekyll' )
  grunt.loadNpmTasks( 'grunt-es6-module-transpiler' )
  grunt.loadNpmTasks( 'grunt-contrib-less' )


  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  //grunt.registerTask('test', ['clean', 'init_porpentine', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerMultiTask('default','Default message',function(){
  
    grunt.log.writeln( this.data.name  );
    grunt.log.writeln( 'Version:', this.data.version );
    grunt.log.writeln( 'Maintainer: ', this.data.name );
    grunt.log.writeln( 'Site:', this.data.url );

  });

  grunt.registerTask( 'watch', [ 'jshint', 'nodeunit', 'less:porpentine', 'concat:css', 'cssmin:porpentine','transpile','concat:amd','browser']);

};
