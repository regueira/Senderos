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
        this.reg = new RegExp( ':(.*)' );
        this.params = {};

        for ( let key in options ) {
            this[ key ] = options[ key ];
        }

        this.stringToRegexp( path );
        this.routeMatcher = new RegExp( path.replace( /:[^\s/]+/g, '([\\w-]+)' ) );
    }

    stringToRegexp( str ) {
        var res;

        while ( ( res = PATH_REGEXP.exec( str ) ) !== null ) {
            let name = res[ 3 ];
            this.params[ name ] = null;
        }
    }

    match( pathName ) {
        if ( !pathName.match( this.routeMatcher ) ) {
            return false;
        }

        let path = pathName.match( this.routeMatcher );
        let i = 0;

        for ( let key in this.params ) {
            this.params[ key ] = path[ ++i ];
        }

        return this.params;
    }
}
