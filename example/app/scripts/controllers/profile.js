import ruta from '../../../../lib/Dispatcher';

export default function( req, data, next ) {
    console.log(ruta);
    console.log( 'controller profile' );
    console.log( req );
    next();
}
