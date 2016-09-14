import {Widget} from 'cx/ui/Widget';
import {startAppLoop} from 'cx/app/startAppLoop';
import {Timing} from 'cx/util/Timing';
import {HtmlElement} from 'cx/ui/HtmlElement';
import {Store} from 'cx/data/Store';

require('./index.scss');

import {GridSection} from './sections/Grid';
import {FormSection} from './sections/Form';
import {WindowSection} from './sections/Window';
import {ListSection} from './sections/List';

import {MixedModeForm} from './components/MixedModeForm';

var store = new Store();

var stop;

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
      store.load(module.hot.data.state);
}


Widget.resetCounter();
Timing.enable('vdom-render');


stop = startAppLoop(document.getElementById('app'), store, <cx>
   <div>
      <h1>Litmus App 12233</h1>
      123123123213
      {/*<FormSection />*/}
      {/*<GridSection />*/}
      {/*<WindowSection />*/}
      {/*<ListSection />*/}
      {/*<MixedModeForm />*/}
   </div>
</cx>);
