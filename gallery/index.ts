import { Store } from 'cx/data';
import { Url, History, startHotAppLoop, enableCultureSensitiveFormatting } from 'cx/ui';
import { Timing, Debug } from 'cx/util';
import {enableTooltips} from 'cx/widgets';
//css
import "./style";
import Routes from './routes';
import {registerStore} from './routes/hmr';

enableTooltips();
enableCultureSensitiveFormatting();


function start() {

   //store
   const store = new Store();

   //routing
   Url.setBaseFromScript('app*.js');
   History.connect(store, 'url');

   //debug
   Timing.enable('app-loop');
   Debug.enable('app-data');

   registerStore(store);

   //app loop
   let stop = startHotAppLoop(module, document.getElementById('app'), store, Routes);
}

if (typeof window["fetch"] === "undefined" || typeof window["Intl"] === "undefined") {
   import("./polyfill")
      .then(start);
} else {
   start();
}

