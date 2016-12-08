/**
 * Simple Dispatcher
 */
import { events } from './Events';
import Path from './modules/Path';
import ExecutionPlan from './modules/ExecutionPlan';
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
         * @variable Boolean
         * @default true
         */
        this._defaultHistory = true;

        /**
         * Handle URL History
         */
        this.history = new History();

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

    set defaultHistory( defaultHistory ) {
        this._defaultHistory = defaultHistory;
    }

    get defaultHistory() {
        return this._defaultHistory;
    }

    /**
     * @public
     * Execute the events for the init process when the app starts.
     * @param list of functions to execute.
     */
    init( ...cb ) {
        let currentPathName = this._clearSlashes( location.pathname + location.search + location.hash );

        new ExecutionPlan( cb ).start( currentPathName, {}, ( err ) => {
            if ( err ) {
                events.publish( 'dispatcher/init/error', currentPathName );
            } else {
                events.publish( 'dispatcher/init/success', currentPathName );

                this.dispatch( {
                    path: currentPathName,
                    context: this._defaultContext,
                    history: false
                } );
            }
        } );
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
     * 1- Example objPath (Object)
     * {
     *      path: '/home',
     *      context: 'get',
     *      history: true
     * }
     *
     * 2- Example objPath (Object)
     * {
     *      path: 'game',
     *      context: 'play',
     *      history: false
     * }
     *
     * 3- Example objPath (Object)
     * {
     *      path: 'game',
     *      context: 'win',
     *      history: false
     * }
     *
     * 4- Example objPath (String)
     * '/home'
     *
     * 5- Example objPath (String)
     * 'game'
     *
     * @param objPath: Object, String or RegExp with the dispatch.
     * @param cb: Callback to call when a url matches.
     * @return Number with the position in the array
     */
    declare( objPath, ...cb ) {

        objPath = this._formatObjPath( objPath );

        for ( let i = 0; i < this.routes.length; i++ ) {
            if ( this.routes[ i ].path === objPath.path ) {
                this.routes[ i ][ objPath.context ] = cb;
                return i;
            }
        }

        let path = new Path( objPath.path, {
            [ objPath.context ]: cb
        } );

        return this.routes.push( path );
    }

    /**
     * Remove a the entire Path form the routes array
     * @param index: Number with the position to remove
     * @return Boolean
     */
    remove( index ) {
        return this.routes.splice( index, 1 ).length > 0;
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
                history: this.defaultHistory
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
     * @param data: Object data
     * @returns Boolean true if the path was found and false if not.
     */
    dispatch( objPath, data = {} ) {

        objPath = this._formatObjPath( objPath );

        for ( let i = 0; i < this.routes.length; i++ ) {

            let request = this.routes[ i ].match( objPath.path );

            if ( request ) {

                if ( this.routes[ i ][ objPath.context ] ) {

                    // Send to the callback the url parameters and the object data
                    new ExecutionPlan( this.routes[ i ][ objPath.context ] ).start( request, data, ( err ) => {
                        if ( err ) {
                            events.publish( 'dispatcher/navigate/error', err );
                        } else {
                            events.publish( 'dispatcher/navigate/success', objPath, data );
                        }
                    } );

                    return true;

                }
            }
        }

        events.publish( 'dispatcher/navigate/notFound', objPath, data );
        return false;
    }
}

export let dispatcher = new Dispatcher();
