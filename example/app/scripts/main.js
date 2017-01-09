import dispatcher from '../../../lib/Dispatcher';
import events from '../../../lib/Events';


import indexController from './controllers/index';
import profileController from './controllers/profile';
import contactController from './controllers/contact';

//import bootstrap from './bootstrap';

// Configure RootPath variable.
dispatcher.rootPath = '/';


// on router success
events.subscribe( 'dispatcher/navigate/success', function( pathname ) {
    console.log ( pathname );
    console.log('evento success');
} );

// on router error
events.subscribe( 'dispatcher/navigate/error', function( pathname ) {
    console.log ( pathname );
    console.log('evento error');
} );

// on router error
events.subscribe( 'dispatcher/navigate/notFound', function( pathname ) {
    console.log ( pathname );
    console.log('evento notFound');
} );


// Define routes
dispatcher.declare( '/profile/:id/hola/:sdf?', profileController, contactController );
dispatcher.declare( { path: '/contacto', context: 'get', history: true }, contactController );
dispatcher.declare( { path: '/contacto', context: 'save', history: false }, contactController );
dispatcher.declare( '/', indexController );

// Execute init
dispatcher.init(
    function( req, data, next ) {
        data.info = 'lalalal';
        console.log( 'Init 1' );
        next();
    },
    function( req, data, next ) {
        console.log( data );
        console.log( 'Init 2' );
        next();
    }
);


// Example
var home = document.getElementById( 'home' );
var profile = document.getElementById( 'profile' );
var profile2 = document.getElementById( 'profile2' );
var contacto = document.getElementById( 'contacto' );
var contacto2 = document.getElementById( 'contacto2' );

profile.onclick = function() {
    dispatcher.dispatch( '/profile/123/hola/123?hola=aaa&chau=bbbb#lalala' );
};

profile2.onclick = function() {
    dispatcher.dispatch( { path: '/profile/1/hola', history: false } );
};


contacto.onclick = function() {
    dispatcher.dispatch( '/contacto?hola=123' );
};

contacto2.onclick = function() {
    dispatcher.dispatch( { path: '/contacto?hola=123', context: 'save' } );
};

home.onclick = function() {
    dispatcher.dispatch( '/' );
};
