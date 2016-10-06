/**
 * History Events handler
 */

import { events } from './Events';
import { router } from '../Router';

export default class HistoryEvents {

    /**
     * Subscribe to events
     */
    constructor() {
        events.subscribe( 'router/init/success', this.init );
        events.subscribe( 'router/navigate/success', this.navigate );
    }

    /**
     * Initialize history.
     * @param pathName
     */
    init( pathName ) {

        //TODO: check the verb
        router.get( pathName );

        window.onpopstate = function( historyEvent ) {
            router.navigate( historyEvent.state.pathName, historyEvent.state.verb, historyEvent.state.data, { isHistory: true } );
        };
    }

    /**
     * Change history.
     * @param pathName
     */
    navigate( objectData ) {
        if ( !objectData.isHistory ) {
            history.pushState( objectData, objectData.pathName, objectData.pathName );
        }
    }
}
