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


export default function() {

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