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
    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },
    nodeunit: {
      tests: [],
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
          dest: "media/js/amd/{%= name %}.amd.js"
        },
        css : {
          src : '_scripts/css/**/*.css',
          dest : 'media/css/main.css'
        },
        porpentine: {
          src: '_scripts/js/**/*.js',
          dest: 'media/js/main.js'
        }
    },
    // Watch the project files.
    watch: {
      js: {
        files : [ '**/_scripts/js/**/*.js' ],
        tasks: [ 'transpile','concat:amd', 'browser'],
        options : {
          livereload : true
        }
      },
      less : {
        files : [ '**/_scripts/less/**/*.less' ],
        tasks : [ 'less:porpentine' ],
        options : {
          livereload : true
        }

      },
      css : {
        files : ['**/_scripts/css/**/*.css'],
        tasks : [ 'concat:css' ],
        options : {
          livereload : true
        }

      },
      jekyll : {
        files: [ './**/*.html', './**/*.yml', './**/*.md', 'media/**/*', '!**/_site/**','!**/node_modules/**' ],
        tasks : ['jekyll:porpentine'],
        options : {
          livereload : true,
          nospawn : true,
          interrupt: false,
          debounceDelay : 250
        }

      }
    },
    // Lint the build files.
    reload : {
      port : 35729,
      liveReload : {},
      proxy : {
        host : 'localhost',
        port: '8080'
      }
    },
    jshint: {
      options : {
       jshintrc : '.jshintrc'
      },
      porpentine : {
        src : [ 'lib/**/*.js' ]
      },
    },
    cssmin : {
      porpentine : {
        options : {
          yuicompress : true,
          report : true
        },
        files : {
          'media/css/lib.css' : '_scripts/css/main.css'
        }
      }
    },
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
          'media/css/main.css' : '_scripts/less/*.less'
        }
      }
    },
    browser: {
      porpentine : {
        src: ["_scripts/loader.js", "media/js/amd/{%= name %}.amd.js"],
        dest: "media/js/main.js",
        options: {
          barename: "{%= name %}",
          namespace: "{%= namespace %}"
        }
      }
    },
    connect: {
      options: {
        port: 3000,
        hostname: 'localhost'
      },
      porpentine: {
        options: {
          middleware: function (connect) {
            return [
              require('connect-livereload')(), // <--- here
              checkForDownload,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'app')
            ];
          }
        }
      }
    }
  });

  grunt.registerMultiTask('browser', "Export a module to the window", function() {
    var opts = this.options();
    this.files.forEach( function(f) {
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
  });

  grunt.event.on( 'watch', function( action, filepath, target ){

    grunt.log.writeln('Why you do nothing?');

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-clean' );
  grunt.loadNpmTasks( 'grunt-contrib-nodeunit' );
  grunt.loadNpmTasks( 'grunt-contrib-concat' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-css' );
  grunt.loadNpmTasks( 'grunt-jekyll' );
  grunt.loadNpmTasks( 'grunt-es6-module-transpiler' );
  grunt.loadNpmTasks( 'grunt-contrib-less' );
  grunt.loadNpmTasks( 'grunt-livereload' );
  grunt.loadNpmTasks( 'grunt-contrib-connect' );
  grunt.loadNpmTasks( 'grunt-reload' );

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  //grunt.registerTask('test', ['clean', 'init_porpentine', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerMultiTask( 'default','Default message', function(){
  
    grunt.log.writeln( this.data.name  );
    grunt.log.writeln( 'Version:', this.data.version );
    grunt.log.writeln( 'Maintainer: ', this.data.name );
    grunt.log.writeln( 'Site:', this.data.url );

    grunt.task.run(['reload','watch']);

  });

};
