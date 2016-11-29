import {Widget} from 'cx/ui/Widget';
import {startAppLoop} from 'cx/app/startAppLoop';
import {Url} from 'cx/app/Url';
import {Timing} from 'cx/util/Timing';
import {Debug} from 'cx/util/Debug';
import {Store} from 'cx/data/Store';
import {setupHashBasedRouting} from '../shared/app/hashRoutes';

import Routes from './routes';

import "./index.scss";

const store = new Store();

if (module.hot) {
    // accept itself
    module.hot.accept();

    // remember data on dispose
    module.hot.dispose(function (data) {
        data.state = store.getData();
        if (stop)
            stop();
    });

    //apply data on hot replace
    if (module.hot.data)
        store.load(module.hot.data.state);
}

Url.setBaseFromScript('~/app.js');
Widget.resetCounter();
Timing.enable('vdom-render');
Debug.enable('app-data');

setupHashBasedRouting(store);
let stop = startAppLoop(document.getElementById('app'), store, Routes);


