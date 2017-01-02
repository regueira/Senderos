'use strict';
import dispatcher from '../lib/Dispatcher';
import events from '../lib/Events';

describe( 'A Dispatcher ', function() {

    let errorEventsFail = true;
    let successEventsFail = false;

    function isErrorEventsFail( message ) {
        if ( errorEventsFail ) {
            fail( message );
        }
    }

    function isSuccessEventsFail( message ) {
        if ( successEventsFail ) {
            fail( message );
        }
    }

    function resetEventsFails() {
        errorEventsFail = true;
        successEventsFail = false;
    }

    // Revert the fails in order to validate the not found or error events.
    function revertEventsFails() {
        resetEventsFails();
        errorEventsFail = !errorEventsFail;
        successEventsFail = !successEventsFail;
    }

    it( 'Declare Events Callbacks', function() {

        // Success events.
        events.subscribe( 'dispatcher/init/success', function( pathName ) {
            expect( typeof pathName ).toEqual( 'string' );
            isSuccessEventsFail( 'Dispatcher init success' );
        } );

        events.subscribe( 'dispatcher/navigate/success', function( objPath, data ) {
            expect( typeof objPath ).toEqual( 'object' );
            expect( typeof data ).toEqual( 'object' );
            isSuccessEventsFail( 'Dispatcher navigate success' );
        } );

        // Error events.
        events.subscribe( 'dispatcher/init/error', function( pathName ) {
            expect( typeof pathName ).toEqual( 'string' );
            isErrorEventsFail( 'Dispatcher Init Error' );
        } );

        events.subscribe( 'dispatcher/navigate/error', function( objPath, data ) {
            expect( typeof objPath ).toEqual( 'object' );
            expect( typeof data ).toEqual( 'object' );
            isErrorEventsFail( 'Dispatcher navigate error' );
        } );

        events.subscribe( 'dispatcher/navigate/notFound', function( objPath, data ) {
            expect( typeof objPath ).toEqual( 'object' );
            expect( typeof data ).toEqual( 'object' );
            isErrorEventsFail( 'Dispatcher navigate not found' );
        } );

    } );

    it( 'Declare entry point & root route', function() {

        dispatcher.declare( '/context.html', function( req, data ) {
            expect( typeof req ).toEqual( 'object' );
            expect( typeof data ).toEqual( 'object' );
        } );

        dispatcher.declare( '/',
            function( req, data, next ) {
                next();
            },
            function( req, data ) {
                expect( typeof req ).toEqual( 'object' );
                expect( typeof data ).toEqual( 'object' );
            }
        );

    } );

    it( 'Declare dynamic routes', function() {
        dispatcher.declare( '/home/:id',
            function( req, data ) {
                expect( typeof data ).toEqual( 'object' );
            }
        );

        dispatcher.declare( '/profile/:id/:title?',
            function( req, data ) {
                expect( req.params.id ).not.toBe( null );
                if ( req.params.title ) {
                    expect( req.params.id ).not.toBe( null );
                }
                expect( typeof data ).toEqual( 'object' );
            }
        );
    } );

    it( 'Declare route using object', function() {

        // String declaration use get context as default
        let strDispatch = dispatcher.declare( '/test/:id', function( req, data ) {
            fail( 'This declaration will never run' );
        } );

        // Object declaration with the default, overwrites old one.
        let objDispatch = dispatcher.declare( {
            path: '/test/:id',
            context: 'get',
            history: false
        }, function( req, data, next ) {
            expect( typeof req ).toEqual( 'object' );
            expect( typeof data ).toEqual( 'object' );
            next();
        } );

        let objTest = dispatcher.declare( {
            path: '/test/:id',
            context: 'test',
            history: false
        }, function( req, data, next ) {
            next();
        } );

        let objOther = dispatcher.declare( {
            path: '/test/:id',
            context: 'other',
            history: true
        }, function( req, data, next ) {
            next();
        } );

        expect( objDispatch ).toEqual( strDispatch );
        expect( objDispatch ).toEqual( objTest );
        expect( objDispatch ).toEqual( objOther );
    } );

    it( 'init process', function() {

        dispatcher.init(
            function( req, data, next ) {
                expect( typeof req ).toEqual( 'string' );
                expect( data ).toEqual( {} );

                next();
            }
        );

    } );

    it( 'navigate static process', function() {
        resetEventsFails();

        dispatcher.dispatch( '/' );
        dispatcher.dispatch( '/?' );
        dispatcher.dispatch( '/#' );
        dispatcher.dispatch( '/?q' );
        dispatcher.dispatch( '/?q=' );
        dispatcher.dispatch( '/?q=123' );
        dispatcher.dispatch( '/?q=123&t=1' );
        dispatcher.dispatch( '/?q=123&t=1#' );
        dispatcher.dispatch( '/?q=123&t=1#anchor' );
        dispatcher.dispatch( '/#anchor' );
    } );

    it( 'navigate dynamic process', function() {
        resetEventsFails();

        dispatcher.dispatch( '/home/1' );
        dispatcher.dispatch( '/home/1?' );
        dispatcher.dispatch( '/home/1#' );
        dispatcher.dispatch( '/home/1/' );
        dispatcher.dispatch( '/home/1/?' );
        dispatcher.dispatch( '/home/1/#' );
        dispatcher.dispatch( '/home/1?q' );
        dispatcher.dispatch( '/home/1/?q' );
        dispatcher.dispatch( '/home/1?q=1' );
        dispatcher.dispatch( '/home/1/?q=1' );
        dispatcher.dispatch( '/home/1?q=1#anchor' );
        dispatcher.dispatch( '/home/1/?q=1#anchor' );
    } );

    it( 'navigate dynamic with optional params', function() {
        resetEventsFails();

        dispatcher.dispatch( '/profile/1' );
        dispatcher.dispatch( '/profile/1/' );
        dispatcher.dispatch( '/profile/1?' );
        dispatcher.dispatch( '/profile/1/?' );
        dispatcher.dispatch( '/profile/1?q=1' );
        dispatcher.dispatch( '/profile/1/?q=1' );
        dispatcher.dispatch( '/profile/1?q=1&test=123' );
        dispatcher.dispatch( '/profile/1?q=1&test' );
        dispatcher.dispatch( '/profile/1?q=1#anchor' );
        dispatcher.dispatch( '/profile/1#' );
        dispatcher.dispatch( '/profile/1/#' );
        dispatcher.dispatch( '/profile/1#anchor' );
        dispatcher.dispatch( '/profile/1/#anchor' );

        dispatcher.dispatch( '/profile/1/title' );
        dispatcher.dispatch( '/profile/1/title/' );
        dispatcher.dispatch( '/profile/1/title?' );
        dispatcher.dispatch( '/profile/1/title#' );
        dispatcher.dispatch( '/profile/1/title/?' );
        dispatcher.dispatch( '/profile/1/title/#' );
        dispatcher.dispatch( '/profile/1/title?q=1' );
        dispatcher.dispatch( '/profile/1/title/?q=1' );
        dispatcher.dispatch( '/profile/1/title/?q' );
        dispatcher.dispatch( '/profile/1/title?q=1&test' );
        dispatcher.dispatch( '/profile/1/title?q=1&test=1' );
        dispatcher.dispatch( '/profile/1/title?q=1&test=1#anchor' );
        dispatcher.dispatch( '/profile/1/title#anchor' );
    } );


    it( 'Navigate to /test/:id using differents contexts', function() {
        resetEventsFails();

        dispatcher.dispatch( '/test/1' );
        dispatcher.dispatch( {
            path: '/test/2',
            context: 'test'
        } );

        dispatcher.dispatch( {
            path: '/test/2',
            context: 'get'
        } );

        revertEventsFails();
        dispatcher.dispatch( {
            path: '/test/2',
            context: 'asdf'
        } );

    } );


    it( 'Removes a dispatch route', function() {
        resetEventsFails();
        dispatcher.dispatch( '/test/1' );
        dispatcher.remove( '/test/:id' );

        revertEventsFails();
        dispatcher.dispatch( '/test/1' );
    } );

} );
