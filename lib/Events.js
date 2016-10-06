/**
 * EventsHandler
 */
class Events {

    constructor() {
        this.events = {};
    }

    /**
     * Execute the callbacks subscribed to an event.
     * @event String: Event to execute.
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
     * Subscribe a callback into an event.
     * @event String: Name of the event to subscribe.
     * @cb function: Callback to execute
     */
    subscribe( event, cb ) {
        if ( !this.events[ event ] ) {
            this.events[ event ] = [];
        }

        this.events[ event ].push( {
            cb: cb
        } );
    }
}
export let events = new Events();
