/**
 * Simple Router KO
 *
 */
import Path from './Path';

export default class Router {

    /**
     * creates a new Router instance.
     * @param options
     */
    constructor( options ) {

        /**
         * List of routes
         * @variable Array
         */
        this.routes = [];

        /**
         * Default root path
         * @variable String
         */
        this.root = '/';

        /**
         * List of valid HTTP verbs
         * @variable Array
         */
        this.verbs = [ 'get', 'head', 'post', 'put', 'delete', 'trace', 'options', 'connect', 'patch' ];

        for ( let key in options ) {
            this[ key ] = options[ key ];
        }

        if ( this.root !== '/' ) {
            this.root = '/' + this._clearSlashes( this.root ) + '/';
        }

        //TODO: refactor this window.onpopstate with a custom event.
        window.onpopstate = function() {
            let path = this._clearSlashes( location.pathname );
            this.navigate( path, 'get', false, false );
        }.bind( this );
    }

    /**
     * @private
     * Remove Slashes in the String
     * @param pathName: String with the path
     * @return pathName without first and last slashes
     */
    _clearSlashes( pathName ) {
        return '/' + pathName.replace( /\/$/, '' ).replace( /^\//, '' );
    }

    /**
     * @private
     * Declare a new verb into the Router array.
     * If the pathName variable isn't present in the array, creates a new object
     * Path and add it into the array.
     * In case of the pathName already exists, add the verb to the Path or
     * override previous one.
     *
     * @param verb: String accepted values: 'get', 'head', 'post', 'put',
     * 'delete', 'trace', 'options', 'connect', 'patch'
     * @param pathName: String/RegExp with the path route.
     * @param cb: Callback to call when a url matches.
     * @return boolean
     */
    _verb( pathName, verb, cb ) {

        if ( this.verbs.indexOf( verb ) < 0 ) {
            //TODO: return a object error.
            return false;
        }

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

        return this.routes.push( path ) > 0;
    }

    /**
     * @public
     * Declare a verb into the router. See method _verb
     *
     * @param pathName: String/RegExp with the path route.
     * @param verb: String accepted values: 'get', 'head', 'post', 'put',
     * 'delete', 'trace', 'options', 'connect', 'patch'
     * @param cb: Callback to execute
     * @return boolean
     */
    declareVerb( pathName, verb, cb ) {
        return this._verb( pathName, verb.toLowerCase(), cb );
    }

    /**
     * @public
     * Declare a get verb into the router
     *
     * @param pathName: String/RegExp with the path route.
     * @param cb: Callback to execute
     * @return boolean
     */
    declareGet( pathName, cb ) {
        return this._verb( pathName, 'get', cb );
    }

    /**
     * @public
     * Declare a post verb into the router
     *
     * @param pathName: String/RegExp with the path route.
     * @param cb: Callback to execute
     * @return boolean
     */
    declarePost( pathName, cb ) {
        return this._verb( pathName, 'post', cb );
    }

    /**
     * @public
     * Declare a put verb into the router
     *
     * @param pathName: String/RegExp with the path route.
     * @param cb: Callback to execute
     * @return boolean
     */
    declarePut( pathName, cb ) {
        return this._verb( pathName, 'put', cb );
    }

    /**
     * @public
     * Navigate to a specific Path.
     *
     * @param pathName: String/RegExp with the path route.
     * @param verb: String accepted values: 'get', 'head', 'post', 'put',
     * 'delete', 'trace', 'options', 'connect', 'patch'
     * @param data: Object data
     * @param pushState: change history
     *
     * TODO: Remove pushState param and use events
     */
    navigate( pathName, verb = 'get', data = {}, pushState = true ) {
        pathName = this._clearSlashes( pathName );

        for ( let i = 0; i < this.routes.length; i++ ) {

            if ( this.routes[ i ].match( pathName ) ) {

                //TODO: Remove pushState, use events instead
                if ( pushState ) {
                    history.pushState( null, null, pathName );
                }

                // Send to the callback the url parameters and the object data
                if ( this.routes[ i ][ verb ] ) {
                    this.routes[ i ][ verb ]( this.routes[ i ].params, data );
                    return true;
                }
            }
        }

        location.href = 'error.html';
    }

    /**
     * A convenient way to navigate with the get verb
     * @param pathName String with the url to navigate.
     */
    get( pathName ) {
        return this.navigate( pathName );
    }

    /**
     * A convenient way to navigate with the post verb
     * @param pathName String with the url to navigate.
     * @param data Objet with the post data
     */
    post( pathName, data ) {
        return this.navigate( pathName, 'post', data );
    }

    /**
     * A convenient way to navigate with the put verb
     * @param pathName String with the url to navigate.
     * @param data Objet with the put data
     */
    put( pathName, data ) {
        return this.navigate( pathName, 'put', data);
    }
}

export let router = new Router();
