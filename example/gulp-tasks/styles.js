'use strict';

module.exports = ( ( bs ) => {
    const gulp = require( 'gulp' );
    const config = require( '../config.json' );

    function lintSass() {
        const gulpStylelint = require( 'gulp-stylelint' );

        return gulp.src( config.app.styles + '/**/*.scss' )
            .pipe( gulpStylelint( {
                failAfterError: global.production,
                reporters: [
                    { formatter: 'verbose', console: true }
                ],
                syntax: 'scss'
            } ) );
    }

    function sass() {
        const gulpif = require( 'gulp-if' );
        const sass = require( 'gulp-sass' );
        const sourcemaps = require( 'gulp-sourcemaps' );
        const postcss = require( 'gulp-postcss' );
        const autoprefixer = require( 'autoprefixer' );
        const cssnano = require( 'cssnano' );

        return gulp.src( config.app.styles + '/*.scss' )
            .pipe( gulpif( !global.production, sourcemaps.init() ) )
            .pipe( sass().on( 'error', sass.logError ) )
            .pipe( postcss( [ autoprefixer( { browsers: [ 'last 2 versions' ] } ) ] ) )
            .pipe( gulpif( global.production, postcss( [ cssnano( { autoprefixer: false } ) ] ) ) )
            .pipe( gulpif( !global.production, sourcemaps.write() ) )
            .pipe( gulp.dest( global.dest + '/styles/' ) )
            .pipe( bs.stream() );
    }

    return {
        lint: lintSass,
        sass: sass
    };
} );
