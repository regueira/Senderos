/**
 * Simple Dispatcher
 */
import events from './Events';
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
         * Singleton
         */
        if ( this.instance ) {
            return this.instance;
        }
        this.instance = this;

        /**
         * List of routes
         * @variable Map
         */
        this.routes = new Map();

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
        this._rootPath = rootPath;
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

        let reg = new RegExp( '^' + this.rootPath );
        if ( !currentPathName.match( reg ) ) {
            return;
        } else {
            currentPathName = currentPathName.replace( reg, '' );
        }

        new ExecutionPlan( cb ).start( currentPathName, {}, ( err ) => {
            if ( err ) {
                events.publish( 'dispatcher/init/error', currentPathName );
            } else {
                events.publish( 'dispatcher/init/success', currentPathName );

                this.dispatch( {
                    path: currentPathName,
                    context: this._defaultContext,
                    history: false,
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
     * Declare a new dispatch into the Router Map.
     * If the objPath object isn't present in the Map, creates a new object
     * Path and add it into the Map.
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

        if ( this.routes.has( objPath.path ) ) {
            let currPath = this.routes.get( objPath.path );
            currPath[ objPath.context ] = cb;
            currPath[ objPath.context + 'History' ] = objPath.history;

            return objPath.path;
        }

        let path = new Path( objPath.path, {
            [ objPath.context ]: cb,
            [ objPath.context + 'History' ]: objPath.history
        } );
        this.routes.set( objPath.path, path );
        return objPath.path;
    }


    /**
     * Remove a the entire Path form the routes Map
     * @param index: key for the routes map
     * @return Boolean
     */
    remove( index ) {
        return this.routes.delete( index );
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
                path: this.rootPath === '/' ?
                    this._clearSlashes( objPath ) :
                    this.rootPath + this._clearSlashes( objPath ),
                context: this.defaultContext,
                history: this.defaultHistory
            };
        } else {
            objPath.path = this.rootPath === '/' ?
                this._clearSlashes( objPath.path ) :
                this.rootPath + this._clearSlashes( objPath.path );

            if ( !objPath.context ) {
                objPath.context = this.defaultContext;
            }
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
    dispatch( paramObjPath, data = {} ) {

        let objPath = this._formatObjPath( paramObjPath );

        let [ currPath, request ] = this._getRoute( objPath.path );

        if ( currPath && request ) {

            if ( currPath[ objPath.context ] ) {

                // Handle History. TODO: Move to a private method.
                if ( typeof paramObjPath.history === 'boolean' ) {
                    objPath.history = paramObjPath.history;
                } else {
                    objPath.history = currPath[ objPath.context + 'History' ];
                }

                // Send to the callback the url parameters and the object data
                new ExecutionPlan( currPath[ objPath.context ] ).start( request, data, ( err ) => {
                    if ( err ) {
                        events.publish( 'dispatcher/navigate/error', err );
                    } else {
                        events.publish( 'dispatcher/navigate/success', objPath, data );
                    }
                } );

                return true;

            }

        }

        events.publish( 'dispatcher/navigate/notFound', objPath, data );
        return false;
    }


    /**
     * @private
     * Get an Object Path from string.
     * @param path: String
     * @return Array: with two values
     *          - CurrPath: Object Path
     *          - req: Request from the Path
     */
    _getRoute( path ) {

        let currPath = null;
        let req = null;
        try {
            if ( this.routes.has( path ) ) {
                currPath = this.routes.get( path );
                req = currPath.match( path );
            }

            if ( !req ) {
                currPath = null;
                for ( let value of this.routes.values() ) {
                    req = value.match( path );
                    if ( req ) {
                        currPath = value;
                        break;
                    }
                }
            }
        } catch ( e ) {
            currPath = null;
            req = null;
        }
        return [ currPath, req ];
    }

}

const instance = new Dispatcher();
export default instance;
