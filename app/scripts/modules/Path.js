export default class Path {
    constructor( options ) {
        this.reg = new RegExp( ':(.*)' );

        for ( let key in options ) {
            this[ key ] = options[ key ];
        }

        this.routeMatcher = new RegExp(this.path.replace(/:[^\s/]+/g, '([\\w-]+)'));
        this.params = {};
    }

    match( pathName ) {
        if( !pathName.match(this.routeMatcher) ) {
            return false;
        }

        let keys = this.reg.exec( this.path );

        if( keys ) {
            this.params[ keys[1] ] = pathName.match(this.routeMatcher)[1];
        }

        return pathName.match(this.routeMatcher)
    }

    /*
    * Validar
    * Buscar que no exista
    * Generar req
    */
}
