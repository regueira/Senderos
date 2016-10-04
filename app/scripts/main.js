import Router from './modules/Router';

var router = new Router();
var home = document.getElementById( 'home' );
var profile = document.getElementById( 'profile' );
var contacto = document.getElementById( 'contacto' );

router.get( '/profile/:id/hola/:sdf', function( req ) {
    console.log( req );
} );

router.post( '/contacto', function( req, data ) {
    console.log( 'controller contacto' );
} );

router.get( '/', function() {
    console.log( 'controller / asdasdasd' );
} );


profile.onclick = function() {
    router.navigate( '/profile/12/hola/asda' );
};

contacto.onclick = function() {
    router.navigate( '/contacto', 'post' );
};

home.onclick = function() {
    router.navigate( '/' );
};
