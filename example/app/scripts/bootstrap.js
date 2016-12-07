import { router } from '../../../lib/Dispatcher';

module.exports = ( pathName ) => {
    router.navigate( pathName );
};
