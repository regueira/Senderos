/*
Implementation

var app = new Router({
    basePath: 'copacoca-cola',
});

app.get( '/', require( 'controller/home' ) );

app.get( '/', function ( req, res ) {
} );

response {
    render: //magia
}
*/

import Router from './modules/Router';

var router = new Router();
var home = document.getElementById( 'home' );
var profile = document.getElementById( 'profile' );
var contacto = document.getElementById( 'contacto' );

router.get( '/profile/:id', function( req ) {
    console.log( 'controller copa', req );
} );

router.get( '/contacto', function() {
    console.log( 'controller contacto' );
} );

router.get( '/', function() {
    console.log( 'controller / asdasdasd' );
} );







profile.onclick = function() {
    router.navigate( '/profile/12' );
};

contacto.onclick = function() {
    router.navigate( '/contacto' );
};

home.onclick = function() {
    router.navigate( '/' );
};
