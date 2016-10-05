import { router } from '../modules/Router';

export default function( req ) {
    var profile;

    console.log( 'controller / asdasdasd' );

    profile = document.getElementById( 'profile' );

    profile.onclick = function() {
        router.navigate( '/profile/123/hola/123' );
    };
}
