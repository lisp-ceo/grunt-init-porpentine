/**
 * grunt-init-jekyll v0.1.0, 2013-04-03
 *
 * Hosted on http://github.com/amsul/grunt-init-jekyll
 * Copyright (c) 2013 Amsul - http://amsul.ca
 * Licensed under the MIT license.
 */

/*jshint
    unused: true,
    debug: true,
    devel: true,
    browser: true,
    asi: true
 */


// Basic template description.
exports.description = 'Porpentine ( ES6, Grunt, Browserify, Jekyll, Less ): Of or relating to porpoises';

// Template-specific notes to be displayed before question prompts.
exports.notes = 'Eeeeeeeeeeek! Let\'s go.';

// Template-specific notes to be displayed after question prompts.
exports.after = 'Eeeeeeeeeeek! We\'re done.';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function( grunt, init, done ) {

    init.process(

        { type: 'porpentine' },

        // Prompt for these values.
        [
            init.prompt( 'name' ),
            init.prompt( 'version' ),
            init.prompt( 'title' ),
            init.prompt( 'description', 'Eeeeek! Another porpentine site.' ),
            init.prompt( 'homepage' ),
            init.prompt( 'repository' ),
            init.prompt( 'licenses', 'MIT' ),
            init.prompt( 'author_name' ),
            init.prompt( 'author_email' ),
            init.prompt( 'author_url' )
        ],

        function( error, props ) {

            // Grab all the files to copy and process.
            var pkgFiles = init.filesToCopy( props )

            // Add the license files.
            init.addLicenseFiles( pkgFiles, props.licenses )

            // Other data to hold in the `package.json` file.
            props.keywords = ['porpentine']
            //props.dependencies = props.jquery_version ? { jquery: props.jquery_version } : {}
            props.devDependencies = {
              'grunt'                       : '~0.4.1',
              'grunt-contrib-jshint'        : '~0.6.0',
              'grunt-contrib-clean'         : '~0.4.0',
              'grunt-contrib-nodeunit'      : '~0.2.0',
              'grunt-contrib-concat'        : '~0.1.1',
              'grunt-contrib-watch'         : '~0.1.4',
              'grunt-css'                   : '~0.5.4',
              'grunt-jekyll'                : '~0.3.9',
              'grunt-es6-module-transpiler' : '~0.4.1'
            };

            props.peerDependencies = {
              'grunt': '~0.4.1'
            };

            // Do the file copying and processing.
            init.copyAndProcess( pkgFiles, props, { noProcess: 'index.html' } )

            // Create the `package.json` file.
            init.writePackageJSON( 'package.json', props );

            // Aaand we're done!
            done()
        }

    ) //init.process

} //exports.template

