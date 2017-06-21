import { Store } from 'cx/data';
import { Url, History, Widget, startAppLoop } from 'cx/ui';
import { Timing, Debug } from 'cx/util';
import {enableTooltips} from 'cx/widgets';
//css
import "./style";
import Routes from './routes';
import {registerStore} from './routes/hmr';

enableTooltips();


export default function() {

   //store
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
   Url.setBaseFromScript('app*.js');
   History.connect(store, 'url');

   //debug
   Widget.resetCounter();
   Timing.enable('app-loop');
   Debug.enable('app-data');

   registerStore(store);

   //app loop
   let stop = startAppLoop(document.getElementById('app'), store, Routes);
}