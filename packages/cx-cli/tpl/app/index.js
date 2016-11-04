//css
import "./index.scss";

//polyfill
import 'whatwg-fetch';

//store
import {Store} from 'cx/data/Store';
const store = new Store();

//webpack (HMR)
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

//routing
import {Url} from 'cx/app/Url';
import {History} from 'cx/app/History';

Url.setBaseFromScript('app.js');
History.connect(store, 'url');

//debug
import {Widget} from 'cx/ui/Widget';
import {Timing} from 'cx/util/Timing';
import {Debug} from 'cx/util/Debug';

Widget.resetCounter();
Timing.enable('app-loop');
Debug.enable('app-data');

//app loop
import {startAppLoop} from 'cx/app/startAppLoop';
import Routes from './routes';

let stop = startAppLoop(document.getElementById('app'), store, Routes);
