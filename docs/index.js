import { startAppLoop, Url, History } from 'cx/ui';
import { Timing, Debug } from 'cx/util';
import { Widget } from 'cx/ui';
import {Main} from './app/Main';
import {store} from './app/store';
import './app/icons';
import "./index.scss";

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

Url.setBaseFromScript('~/vendor.*.js');
History.connect(store, 'url');
Widget.resetCounter();
//Timing.enable('app-loop');
Timing.enable('vdom-render');
Debug.enable('app-data');
//Widget.lazyInit = false;
//Widget.optimizePrepare = false;
//Debug.enable('process-data');
//Debug.enable('should-update');

let stop = startAppLoop(document.getElementById('app'), store, Main);

// #if production
import {setupGoogleAnalytics} from "./ga";
setupGoogleAnalytics();
// #end
