import { Widget, startAppLoop } from 'cx/ui';
import { HtmlElement } from 'cx/widgets';
import { Timing, Debug } from 'cx/util';
import { Store } from 'cx/data';
import "./error";


import './index.scss';

// import {GridSection} from './sections/Grid';
// import {FormSection} from './sections/Form';
// import {WindowSection} from './sections/Window';
// import {ListSection} from './sections/List';
// import ComplexGrid from './sections/ComplexGrid';
// import TimeSeries from './sections/features/TimeSeriesScroll';
//
// import {MixedModeForm} from './components/MixedModeForm';

import LongList from './performance/LongList';

let store = new Store();

Widget.resetCounter();
//Widget.optimizePrepare = false;
//Widget.prototype.memoize = false;
Timing.enable('vdom-render');
//Debug.enable("should-update");


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

let stop = startAppLoop(document.getElementById('app'), store, <cx>
   <div>
      <h1>Litmus App</h1>
      <LongList />
   </div>
</cx>);