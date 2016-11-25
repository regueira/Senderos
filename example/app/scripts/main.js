import { router } from '../../../lib/Router';
import { events } from '../../../lib/Events';


import indexController from './controllers/index';
import profileController from './controllers/profile';
import contactController from './controllers/contact';

import bootstrap from './bootstrap';

// Configure router
router.configure( {
    //verbs : ['get','post'],
} );

// on router success
events.subscribe( 'router/navigate/success', function( pathname ) {
    console.log ( pathname );
    console.log('evento success');
} );

// on router error
events.subscribe( 'router/navigate/error', function( pathname ) {
    console.log ( pathname );
    console.log('evento error');
} );

// Define routes
router.declareGet( '/profile/:id/hola/:sdf?', profileController );
router.declareGet( '/contacto', contactController );
router.declareGet( '/', indexController );

events.subscribe( 'router/init/success', bootstrap );

router.init();


// Example
var home = document.getElementById( 'home' );
var profile = document.getElementById( 'profile' );
var profile2 = document.getElementById( 'profile2' );
var contacto = document.getElementById( 'contacto' );

profile.onclick = function() {
    router.get( '/profile/123/hola/123?hola=aaa&chau=bbbb#lalala' );
};

profile2.onclick = function() {
    router.get( '/profile/1/hola' );
};


contacto.onclick = function() {
    router.get( '/contacto?hola=123' );
};

home.onclick = function() {
    router.get( '/' );
};
