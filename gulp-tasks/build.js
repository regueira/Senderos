'use strict';

module.exports = ( () => {
    const gulp = require( 'gulp' );
    const config = require( '../config.json' );

    function html() {
        const useref = require( 'gulp-useref' );
        const gulpif = require( 'gulp-if' );
        const uglify = require( 'gulp-uglify' );
        const htmlmin = require( 'gulp-htmlmin' );

        return gulp.src( config.app.root + '/*.html' )
            .pipe( useref( { searchPath: [ config.temp, config.app.root ] } ) )
            .pipe( gulpif( '*.js', uglify() ) )
            .pipe( gulpif( '*.html', htmlmin( {
                removeComments: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeAttributeQuotes: true,
                removeRedundantAttributes: true,
                removeEmptyAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeOptionalTags: true
            } ) ) )
            .pipe( gulp.dest( global.dest ) );
    }

    function copy() {
        return gulp.src( [
            config.app.fav + '/*.*',
            config.app.root + '/*.*',
            config.app.fonts + '/*.*',
            config.app.statics + '/**/*',

            '!' + config.app.root + '/*.html',
            '!' + config.app.statics + '/**/_*.*'
        ], { base: config.app.root, dot: true } )
            .pipe( gulp.dest( global.dest ) );
    }

    function images() {
        const imagemin = require( 'gulp-imagemin' );
        const gutil = require( 'gulp-util' );

        return gulp.src( [ config.app.images + '/**/*' ] )
            .pipe( imagemin( [
                imagemin.jpegtran( { progressive: true } ),
                imagemin.optipng(),
                imagemin.svgo()
            ] ) ).on( 'error', gutil.log )
            .pipe( gulp.dest( global.dest + '/images/' ) );
    }

    function speedTest( done ) {
        const psi = require( 'psi' );
        let threshold = 70;

        psi.output( global.url, { threshold, locale: 'es' } ).then( () => {
            psi( global.url, { threshold, strategy: 'desktop' } ).then( data => {
                console.log( 'Strategy:  desktop\nSpeed:     %s%s', data.ruleGroups.SPEED.score, '\n' );
            } ).then( done );
        } );
    }

    return {
        html: html,
        copy: copy,
        images: images,
        speedTest: speedTest
    };
} );
