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
         * @variable String
         * @Default 'get'
         */
        this._defaultContext = 'get';

        /**
         * @deprecated
         * Use rootPath instead
         *
         * Default root path
         * @variable String
         * @Default '/'
         */
        this.root = this._rootPath;

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


    set rootPath( rootPath ) {
        if ( rootPath !== '/' ) {
            this._rootPath = '/' + this._clearSlashes( rootPath ) + '/';
        }
    }
    get rootPath() {
        return this._rootPath;
    }

    set defaultContext( defaultContext ) {
        this._defaultContext = defaultContext;
    }

    get defaultContext() {
        return this._defaultContext;
    }


    /**
     * @public
     * Execute the events for the init process when the app starts.
     * @param list of functions to execute.
     */
    init( ...cb ) {
        let currentPathName = this._clearSlashes( location.pathname );

        // TODO: Execute callbacks;

        events.publish( 'dispatcher/init/success', currentPathName );

        this.dispatch( currentPathName );
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
     * @public
     * Declare a new dispatch into the Router array.
     * If the objPath object isn't present in the array, creates a new object
     * Path and add it into the array.
     * In case of the objPath already exists, add the context to the Path or
     * override previous one.
     *
     * Example objPath (Object)
     * {
     *      path: '/home',
     *      context: 'get',
     *      history: true
     * }
     *
     * Example objPath (String)
     * '/home'
     *
     * @param objPath: Object or String with the dispatch.
     * @param pathName: String/RegExp with the path route.
     * @param cb: Callback to call when a url matches.
     * @return boolean
     */
    setDispatch( objPath, cb ) {

        objPath = this._formatObjPath( objPath );

        for ( let i = 0; i < this.routes.length; i++ ) {
            if ( this.routes[ i ].path === objPath.path ) {
                this.routes[ i ][ objPath.context ] = cb;
                return true;
            }
        }

        let path = new Path( objPath.path, {
            [ objPath.context ]: cb
        } );

        return this.routes.push( path ) > 0;
    }


    /**
     * @private
     * Format objPath in order to accept Object and String
     * @param objPath Object/String
     * @return Object
     */
    _formatObjPath( objPath ) {

        if ( typeof ( objPath ) === 'string' ) {
            objPath = {
                path: this._clearSlashes( objPath ),
                context: this.defaultContext,
                history: true
            };
        } else {
            objPath.path = this._clearSlashes( objPath.path );
        }
        return objPath;
    }

    /**
     * @public
     * Dispatch to a specific Path.
     *
     * @param pathName: String/RegExp/Object with the path route.
     * @param data:     Object data
     * @returns Boolean
     */
    dispatch( objPath, data = {} ) {

        objPath = this._formatObjPath( objPath );

        for ( let i = 0; i < this.routes.length; i++ ) {

            let request = this.routes[ i ].match( objPath.path );

            if ( request ) {

                if ( this.routes[ i ][ objPath.context ] ) {

                    objPath.data = data;
                    events.publish( 'dispatcher/navigate/success', objPath );

                    // Send to the callback the url parameters and the object data
                    this.routes[ i ][ objPath.context ]( request, data );
                    return true;

                }
            }
        }

        events.publish( 'dispatcher/navigate/error', objPath );
        return false;

    }

}

export let dispatcher = new Dispatcher();
