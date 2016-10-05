import { router } from './modules/Router';

import indexController from './controllers/index';
import profileController from './controllers/profile';
import contactController from './controllers/contact';

// Configure router
router.configure ({
    //verbs : ['get','post']
})

// Define routes
router.declareGet( '/profile/:id/hola/:sdf', profileController);
router.declarePost( '/contacto', contactController );
router.declareGet( '/', indexController );


// Example
var home = document.getElementById( 'home' );
var profile = document.getElementById( 'profile' );
var contacto = document.getElementById( 'contacto' );

profile.onclick = function() {
    router.get( '/profile/12/hola/asda' );
};

contacto.onclick = function() {
    router.post( '/contacto' );
};

home.onclick = function() {
    router.get( '/' );
};
