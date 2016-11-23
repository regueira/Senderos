'use strict';

module.exports = ( () => {
    const gulp = require( 'gulp' );
    const config = require( '../config.json' );

    function lintJs() {
        const eslint = require( 'gulp-eslint' );
        const gulpif = require( 'gulp-if' );

        return gulp.src( [ config.app.scripts + '/**/*', '!' + config.app.scripts + '/vendors', config.app.lib + '/**/*' ] )
            .pipe( eslint() )
            .pipe( eslint.format() )
            .pipe( gulpif( global.production, eslint.failAfterError() ) );
    }

    function brify() {
        const browserify = require( 'browserify' );
        const babelify = require( 'babelify' );
        const hbsfy = require( 'hbsfy' );
        const source = require( 'vinyl-source-stream' );
        const gulpif = require( 'gulp-if' );
        const buffer = require( 'vinyl-buffer' );
        const sourcemaps = require( 'gulp-sourcemaps' );
        const es2015 = require( 'babel-preset-es2015');
        const uglify = require( 'gulp-uglify' );
        const gutil = require( 'gulp-util' );

        // set up the browserify instance on a task basis
        let b = browserify( {
            entries: config.app.scripts + '/main.js',
            debug: true,
            // defining transforms here will avoid crashing your stream
            transform: [ babelify.configure( {
                presets: [ es2015 ]
            } ), hbsfy ]
        } );

        return b.bundle()
            .pipe( source( 'main.js' ) )
            .pipe( buffer() )
            .pipe( gulpif( !global.production, sourcemaps.init( { loadMaps: true } ) ) )
            // Add transformation tasks to the pipeline here.
            .pipe( gulpif( global.production, uglify() ) )
            .on( 'error', gutil.log )
            .pipe( gulpif( !global.production, sourcemaps.write() ) )
            .pipe( gulp.dest( global.dest + '/scripts/' ) );
    }


    return {
        lint: lintJs,
        browserify: brify
    };
} );
