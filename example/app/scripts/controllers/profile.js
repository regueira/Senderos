import { dispatcher } from '../../../../lib/Dispatcher';

export default function( req, data, next ) {
    console.log( 'controller profile' );
    console.log( req );
    next();
}
