/**
 * History Events handler
 */

import { events } from '../Events';
import { dispatcher } from '../Dispatcher';

export default class HistoryEvents {

    /**
     * Subscribe to events
     */
    constructor() {
        events.subscribe( 'dispatcher/init/success', this.init );
        events.subscribe( 'dispatcher/navigate/success', this.navigate );
    }

    /**
     * Initialize history.
     * @param pathName
     */
    init( pathName ) {

        window.onpopstate = function( historyEvent ) {
            dispatcher.dispatch( historyEvent.state.path, historyEvent.state.context, historyEvent.state.data, { history: true } );
        };
    }

    /**
     * Change history.
     * @param pathName
     */
    navigate( objectData ) {
        console.log( objectData );
        if ( !objectData.history ) {
            history.pushState( objectData, objectData.path, objectData.path );
        }
    }
}
