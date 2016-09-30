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

    get( pathName, cb ) {
        pathName = this._clearSlashes( pathName );

        for ( let i = 0; i < this.routes.length; i++ ) {
            if ( this.routes[ i ].path === pathName ) {
                this.routes[ i ].get = cb;
                return;
            }
        }

        let path = new Path( {
            path: pathName,
            get: cb
        } );

        this.routes.push( path );
        return this;
    }

    navigate( pathName, method = 'get', pushState = true ) {
        pathName = this._clearSlashes( pathName );

        for ( let i = 0; i < this.routes.length; i++ ) {
            if ( this.routes[ i ].match( pathName ) ) {
                if ( pushState ) {
                    history.pushState( null, null, pathName );
                }

                this.routes[ i ][ method ]( this.routes[ i ].params );
                return true;
            }
        }

        console.log( '404' );
        //location.href = 'error.html';
    }
}
