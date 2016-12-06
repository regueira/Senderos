/**
 * Simple Dispatcher
 */
import Path from './modules/Path';

import { events } from './Events';
import History from './handlers/History';

class Dispatcher {

    /**
     * creates a new Dispatcher instance.
     * @param options
     */
    constructor() {

        /**
         * List of routes
         * @variable Array
         */
        this.routes = [];

        /**
         * Default root path
         * @variable String
         * @Default '/'
         */
        this._rootPath = '/';

        /**
         * @deprecated
         * Use rootPath instead
         *
         * Default root path
         * @variable String
         * @Default '/'
         */
        this.root = this.rootPath;

        /**
         * @deprecated
         * Enable or not the history events.
         * @variable boolean
         * @Default true
         */
        this.hasHistory = true;

        /**
         * @deprecated
         * List of valid HTTP verbs
         * @variable Array
         */
        this.verbs = [ 'get', 'head', 'post', 'put', 'delete', 'trace', 'options', 'connect', 'patch' ];
    }


    set rootPath ( rootPath ) { this._rootPath = rootPath; }
    get rootPath () { return this._rootPath; }



    /**
     * @deprecated
     * @public
     * Configure the router variables.
     * @param options object
     */
    configure( options ) {
        for ( let key in options ) {
            this[ key ] = options[ key ];
        }

        if ( this.rootPath !== '/' ) {
            this.rootPath = '/' + this._clearSlashes( this.rootPath ) + '/';
        }

        if ( this.hasHistory ) {
            this.history = new History();
        }

        events.publish( 'router/configure/success', this._clearSlashes( location.pathname ) );
    }

    /**
     * @public
     * Execute the events for the init process.
     */
    init() {
        events.publish( 'router/init/success', this._clearSlashes( location.pathname ) );
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
     * @param data:     Object data
     * @param options:  Object to set options to the navigate route.
     *          Example: {
     *                      isHistory: true
     *                   }
     */
    navigate( pathName, verb = 'get', data = {}, options = {} ) {
        pathName = this._clearSlashes( pathName );

        for ( let i = 0; i < this.routes.length; i++ ) {

            let request = this.routes[ i ].match( pathName );

            if ( request ) {

                if ( this.routes[ i ][ verb ] ) {

                    let _options = {
                        pathName: pathName,
                        verb: verb,
                        data: data
                    };

                    if ( options.isHistory ) {
                        _options.isHistory = options.isHistory;
                    }

                    events.publish( 'router/navigate/success', _options );

                    // Send to the callback the url parameters and the object data
                    this.routes[ i ][ verb ]( request, data );
                    return true;
                }
            }
        }

        events.publish( 'router/navigate/error', pathName );
        return false;
    }

    /**
     * A convenient way to navigate with the get verb
     * @param pathName String with the url to navigate.
     * @param data Objet with the post data
     */
    get( pathName, data ) {
        return this.navigate( pathName, 'get', data );
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
        return this.navigate( pathName, 'put', data );
    }
}

export let router = new Router();
