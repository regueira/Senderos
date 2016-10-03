import Path from './Path';

export default class Router {
    constructor( options ) {
        this.routes = [];
        this.root = '/';

        for ( let key in options ) {
            this[ key ] = options[ key ];
        }

        if ( this.root !== '/' ) {
            this.root = '/' + this._clearSlashes( this.root ) + '/';
        }

        window.onpopstate = function() {
            let path = this._clearSlashes( location.pathname );
            this.navigate( path, 'get', false );
        }.bind( this );
    }

    _clearSlashes( path ) {
        return '/' + path.replace( /\/$/, '' ).replace( /^\//, '' );
    }

    /**
     * @private
     * Declare a new verb into the Router array.
     * If the pathName variable isn't present in the array, creates a new object
     * Path and add it in the array.
     * In case of the pathName already exists, add the verb to the Path or
     * override previus one.
     *
     * @param verb: String accepted values: 'get', 'post', 'put', 'options',
     * 'delete', 'head', 'trace' and 'connect'
     * @param pathName: String/RegExp with the path route.
     * @param cb: Callback to call when a url matches.
     */
    _verb( pathName, verb, cb ) {
        //TODO: validate verb string.
        pathName = this._clearSlashes( pathName );

        for ( let i = 0; i < this.routes.length; i++ ) {
            if ( this.routes[ i ].path === pathName ) {
                this.routes[ i ][ verb ] = cb;
                return;
            }
        }

        let path = new Path( pathName, {
            [ verb ]: cb
        } );

        this.routes.push( path );
        return this;

    }

    /**
     * @public
     * Declare a verb into the router.
     *
     * @param pathName: String/RegExp with the path route.
     * @param verb: String accepted values: 'get', 'post', 'put', 'options',
     * 'delete', 'head', 'trace' and 'connect'
     * @param cb: Callback to execute
     */
    verb( pathName, verb, cb ) {
        this._verb( pathName, verb, cb );
    }

    /**
     * @public
     * Declare a get verb into the router
     *
     * @param pathName: String/RegExp with the path route.
     * @param cb: Callback to execute
     */
    get( pathName, cb ) {
        this._verb( pathName, 'get', cb );
    }

    /**
     * @public
     * Declare a post verb into the router
     *
     * @param pathName: String/RegExp with the path route.
     * @param cb: Callback to execute
     */
    post( pathName, cb ) {
        this._verb( pathName, 'post', cb );
    }

    /**
     * @public
     * Navigate to a specific Path.
     *
     * @param pathName: String/RegExp with the path route.
     * @param verb: String accepted values: 'get', 'post', 'put', 'options',
     * 'delete', 'head', 'trace' and 'connect'
     * @param data: Object data
     * @param pushState: change history
     */
    navigate( pathName, verb = 'get', data = {}, pushState = true ) {
        pathName = this._clearSlashes( pathName );

        for ( let i = 0; i < this.routes.length; i++ ) {
            if ( this.routes[ i ].match( pathName ) ) {

                //TODO: Remove pushState, use events instead
                if ( pushState ) {
                    history.pushState( null, null, pathName );
                }

                this.routes[ i ][ verb ]( this.routes[ i ].params );
                return true;
            }
        }

        location.href = 'error.html';
    }
}
