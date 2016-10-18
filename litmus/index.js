import {Widget} from 'cx/ui/Widget';
import {startAppLoop} from 'cx/app/startAppLoop';
import {Timing} from 'cx/util/Timing';
import {Debug} from 'cx/util/Debug';
import {HtmlElement} from 'cx/ui/HtmlElement';
import {Store} from 'cx/data/Store';

import './index.scss';

import {GridSection} from './sections/Grid';
import {FormSection} from './sections/Form';
import {WindowSection} from './sections/Window';
import {ListSection} from './sections/List';
import ComplexGrid from './sections/ComplexGrid';
import TimeSeries from './sections/features/TimeSeriesScroll';

import {MixedModeForm} from './components/MixedModeForm';

var store = new Store();

var stop;

Widget.resetCounter();
Timing.enable('vdom-render');
//Debug.enable("should-update");


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

stop = startAppLoop(document.getElementById('app'), store, <cx>
   <div>
      <h1>Litmus App</h1>
      {/*<TimeSeries />*/}
      <ComplexGrid />
   </div>
</cx>);