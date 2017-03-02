import { Widget, startAppLoop } from 'cx/ui';
import { HtmlElement } from 'cx/widgets';
import { Timing, Debug } from 'cx/util';
import { Store } from 'cx/data';
import "./error";


import './index.scss';

// import {GridSection} from './sections/Grid';
// import {FormSection} from './sections/Form';
// import {WindowSection} from './sections/Window';
//import {ListSection as Demo} from './sections/List';
// import ComplexGrid from './sections/ComplexGrid';
// import TimeSeries from './sections/features/TimeSeriesScroll';
// import {MixedModeForm} from './components/MixedModeForm';
//import Demo from './performance/LongList';

//import Demo from './bugs/80';
//import Demo from './bugs/search';

//import Demo from './features/drag-drop/ReorderInsertionLine';
//import Demo from './features/drag-drop/ReorderSpace';
//import Demo from './features/drag-drop/trello';
//import Demo from './features/drag-drop/grid-to-grid';
//import Demo from './features/drag-drop/ReorderHorizontal';
//import Demo from './features/drag-drop/Boxes';

import Demo from './features/grid/header-tool';

let store = new Store();

Widget.resetCounter();
//Widget.optimizePrepare = false;
//Widget.prototype.memoize = false;
Timing.enable('vdom-render');
//Timing.enable('app-loop');
//Debug.enable("app-data");


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
      <Demo />
   </div>
</cx>);