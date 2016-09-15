import {Widget} from 'cx/ui/Widget';
import {Main} from './app/Main';
import {startAppLoop} from 'cx/app/startAppLoop';
import {showError, hideError} from 'cx/app/error';
import {Url} from 'cx/app/Url';
import {History} from 'cx/app/History';
import {Timing} from 'cx/util/Timing';
import {Debug} from 'cx/util/Debug';
import {store} from './app/store';

import "./index.scss";

var stop;

hideError();

if (module.hot) {
    // accept itself
    module.hot.accept(err=> {
        showError(err.stack);
    });

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

Url.setBaseFromScript('~/vendor.js');
History.connect(store, 'url');
Widget.resetCounter();
//Timing.enable('app-loop');
Timing.enable('vdom-render');
Debug.enable('app-data');
//Widget.lazyInit = false;
//Widget.optimizePrepare = false;
//Debug.enable('process-data');
//Debug.enable('should-update');

stop = startAppLoop(document.getElementById('app'), store, Main);

// #if production
import {setupGoogleAnalytics} from "./ga";;
setupGoogleAnalytics();
// #end
