/**
 * EventsHandler
 */
class Events {

    constructor() {
        /**
         * Singleton
         */
        if ( this.instance ) {
            return this.instance;
        }
        this.instance = this;

        this.events = {};
    }

    /**
     * @public
     * Execute the callbacks subscribed to an event.
     * @param event String: Event to execute.
     */
    publish( event ) {
        var subscribers;
        var len;

        if ( !this.events[ event ] ) {
            return false;
        }

        subscribers = this.events[ event ];
        len = subscribers.length;

        while ( len-- ) {
            subscribers[ len ].cb.apply( null, [].slice.call( arguments, 1 ) );
        }
    }

    /**
     * @public
     * Subscribe a callback into an event.
     * @param event String: Name of the event to subscribe.
     * @param cb function: Callback to execute
     * @return id number of the event
     */
    subscribe( event, cb ) {
        let _id;

        if ( !this.events[ event ] ) {
            this.events[ event ] = [];
        }

        _id = Math.random().toString( 36 ).substr( 2, 6 );

        this.events[ event ].push( {
            cb: cb,
            id: _id
        } );

        return _id;
    }


    /**
     * @public
     * Unsubscribe a callback to an event.
     * @param String: Name of the event to unsubscribe.
     * @param id: id number of the event object.
     * @return boolean. True if the callback was removed
     *                  False if can't find the event or callback.
     */
    unsubscribe( event, id ) {
        var subscribers;
        var len;

        if ( !this.events[ event ] ) {
            return false;
        }

        subscribers = this.events[ event ];
        len = subscribers.length;

        while ( len-- ) {
            if ( subscribers[ len ].id == id ) {
                return subscribers.splice( len, 1 ).length > 0;
            }
        }

        return false;
    }

}

const instance = new Events();
export default instance;
