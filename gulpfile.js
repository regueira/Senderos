'use strict';

const gulp = require( 'gulp' );
const bs = require( 'browser-sync' ).create();
const historyApiFallback = require( 'connect-history-api-fallback' );

const config = require( './config.json' );

global.url = 'http://www.copacoca-cola.com.ar/copacoca-cola/';

gulp.task( 'serve', gulp.series( clean, develop, browserSync ) );
gulp.task( 'build', gulp.series( clean, build ) );
gulp.task( 'serve:build', gulp.series( clean, build, browserSync ) );

function clean( done ) {
    let del = require( 'del' );

    del( [ config.temp, config.build ] ).then( () => {
        done();
    } );
}

function develop( done ) {
    global.production = false;
    global.dest = config.temp;

    gulp.parallel( styles, scripts )( done );
}

function build( done ) {
    global.production = true;
    global.dest = config.build;

    gulp.parallel( styles, scripts, buildTasks )( done );
}

function styles( done ) {
    const tasks = require( './gulp-tasks/styles' )( bs );
    gulp.series( tasks.lint, tasks.sass )( done );
}

function scripts( done ) {
    const tasks = require( './gulp-tasks/scripts' )();
    gulp.series( tasks.lint, tasks.browserify )( done );
}

function buildTasks( done ) {
    const tasks = require( './gulp-tasks/build' )();
    gulp.series( gulp.parallel( tasks.html, tasks.copy, tasks.images ), tasks.speedTest )( done );
}

function browserSync() {
    bs.init( {
        port: 9000,
        server: {
            baseDir: [ config.build, config.temp, config.app.root ],
            routes: {
                '/bower_components': 'bower_components'
            },
            middleware: [ historyApiFallback() ]
        }
    } );

    gulp.watch( [ config.app.scripts + '/**/*.js', config.app.templates + '/*.hbs' ] ).on( 'all', gulp.series( scripts, bs.reload ) );
    gulp.watch( config.app.styles + '/**/*.scss' ).on( 'all', styles );
    gulp.watch( config.app.root + '/*.html' ).on( 'all', bs.reload );
    gulp.watch( config.app.statics + '/*.*', bs.reload );
}
