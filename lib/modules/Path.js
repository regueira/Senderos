/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
const PATH_REGEXP = new RegExp( [
    // Match escaped characters that would otherwise appear in future matches.
    // This allows the user to escape special characters that won't transform.
    '(\\\\.)',
    // Match Express-style parameters and un-named parameters with a prefix
    // and optional suffixes. Matches appear as:
    //
    // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
    // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
    // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
    '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join( '|' ), 'g' );

export default class Path {

    constructor( path, options ) {
        //this.reg = new RegExp( ':(.*)' );
        this._request = {
            'params': {},
            'query': {},
            'anchor': ''
        };

        for ( let key in options ) {
            this[ key ] = options[ key ];
        }

        this.stringToRegexp( path );

        // 1- replace optional parameters with a special RegExp
        // 2- replace mandatory parameters with a special RegExp
        // 3- Append a posibility to receive trailing slash
        // 4- Append the posibility to receive Query String
        // 5- Append the posibility to receive an Anchor
        // 6- Append the posibility to receive the url with a final character ? or #
        // 7- finish the string RegExp
        this.routeMatcher = new RegExp(
            path
                .replace( /\/:[^\s/]+[\?]/g, '(?:/([\\w-]+))?' )
                .replace( /:[^\s/]+/g, '([\\w-]+)' )
                .concat( '(?:\/)?' )
                .concat( '(?:\\?([^#]+))?' )
                .concat( '(?:#(.+))?' )
                .concat( '(?:\\?|#)?' )
                .concat( '$' )
        );

        // Match query string
        this.queryStringMatcher = new RegExp( '([^?=&]+)(?:=([^&]*))?', 'g' );
    }

    stringToRegexp( str ) {
        var res;

        while ( ( res = PATH_REGEXP.exec( str ) ) !== null ) {
            let name = res[ 3 ];
            this._request[ 'params' ][ name ] = null;
        }
    }

    match( pathName ) {
        let request = {
            'params': {},
            'query': {},
            'anchor': ''
        };

        if ( !pathName.match( this.routeMatcher ) ) {
            return false;
        }

        let path = pathName.match( this.routeMatcher );
        let i = 0;

        for ( let key in this._request[ 'params' ] ) {
            if ( path[ ++i ] !== undefined ) {
                request[ 'params' ][ key ] = path[ i ];
            }
        }

        // Check for Query String
        if ( path[ ++i ] !== undefined ) {
            path[ i ].replace(
                this.queryStringMatcher,
                ( $0, $1, $2 ) => {
                    request[ 'query' ][ $1 ] = $2;
                }
            );
        }

        // Check for Anchor
        if ( path[ ++i ] !== undefined ) {
            request[ 'anchor' ] = path[ i ];
        }

        return request;
    }
}
