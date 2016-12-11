/**
 *
 */
export default class ExecutionPlan {

    constructor( _listCB ) {
        this.listCB = _listCB;
    }

    start( req, data, done ) {
        var index = 0;
        var listCB = this.listCB;

        if ( listCB.length === 0 ) {
            return done();
        }

        next();
        function next( err ) {
            if ( err || listCB[ index ] === undefined ) {
                return done( err );
            }

            let currCB = listCB[ index++ ];
            currCB( req, data, next );

            // There is no next callback so fire done callback.
            if ( currCB.length < 3 ) {
                done( err );
            }
        }

    }
}
