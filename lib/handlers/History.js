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
    init() {

        window.onpopstate = function( historyEvent ) {
            dispatcher.dispatch( {
                path: historyEvent.state.path,
                context: historyEvent.state.context,
                history: false
            }, historyEvent.state.data );
        };
    }

    /**
     * Change history.
     * @param pathName
     */
    navigate( objPath, data ) {
        if ( objPath.history ) {
            objPath.data = data;
            history.pushState( objPath, objPath.path, objPath.path );
        }
    }
}
