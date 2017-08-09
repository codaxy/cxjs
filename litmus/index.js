import { Widget, startAppLoop, History } from 'cx/ui';
import { HtmlElement } from 'cx/widgets';
import { Timing, Debug } from 'cx/util';
import { Store } from 'cx/data';
import "./error";


import './index.scss';

// import {GridSection as Demo} from './sections/Grid';
// import {FormSection as Demo} from './sections/Form';
// import {WindowSection as Demo} from './sections/Window';
// import {ListSection as Demo} from './sections/List';
// import Demo from './sections/ComplexGrid';
// import Demo from './sections/features/TimeSeriesScroll';
// import {MixedModeForm as Demo} from './components/MixedModeForm';
// import Demo from './performance/LongList';
//
//
// import Demo from './bugs/80';
// import Demo from './bugs/192';
// import Demo from './bugs/search';
// import Demo from './bugs/NativeCheckboxesAndRadios';
//import Demo from './bugs/Repeater';

//import Demo from './features/flexbox';

//import Demo from './features/drag-drop/ReorderInsertionLine';
//import Demo from './features/drag-drop/Dashboard';
//import Demo from './features/drag-drop/trello';
//import Demo from './features/drag-drop/grid-to-grid';
//import Demo from './features/drag-drop/ReorderHorizontal';
//import Demo from './features/drag-drop/Boxes';
//import Demo from './features/wheel';
//import Demo from './features/logo';
//import Demo from './features/destroy';
//import Demo from './bugs/179';

//import Demo from './features/grid/header-tool';
//import Demo from './features/grid/GridBuffering';
import Demo from './features/grid/RowEditing';
//import Demo from './features/hscroll';

//import Demo from './features/menu/icons';

//import Demo from './features/fun-comps/ts';
//import Demo from './features/fun-comps/js';

let store = new Store();

Widget.resetCounter();
//Widget.optimizePrepare = false;
//Widget.prototype.memoize = false;
//Timing.enable('vdom-render');
Timing.enable('app-loop');
Debug.enable("app-data");

History.connect(store, "url");


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

