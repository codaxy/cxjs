import Routes from './routes';
import {Widget} from 'cx/ui/Widget';
import {startAppLoop} from 'cx/app/startAppLoop';
import {Url} from 'cx/app/Url';
import {History} from 'cx/app/History';
import {Timing} from 'cx/util/Timing'
import {Debug} from 'cx/util/Debug'
import {Store} from 'cx/data/Store';

import 'whatwg-fetch';

import "./index.scss";

let stop;

const store = new Store();

if(module.hot) {
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
    store.load(module.hot.data);
}

Url.setBaseFromScript('app.js');
History.connect(store, 'url');
Widget.resetCounter();
Timing.enable('app-loop');
Debug.enable('app-data');

stop = startAppLoop(document.getElementById('app'), store, Routes);
