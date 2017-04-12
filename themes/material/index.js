import { Widget, startAppLoop, Url } from 'cx/ui';
import { Timing, Debug } from 'cx/util';
import { Store } from 'cx/data';
import { enableMaterialLabelPlacement, enableMaterialHelpPlacement } from "cx-theme-material";

enableMaterialHelpPlacement();
enableMaterialLabelPlacement();

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


