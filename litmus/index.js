import { Widget, startAppLoop } from 'cx/ui';
import { HtmlElement } from 'cx/widgets';
import { Timing, Debug } from 'cx/util';
import { Store } from 'cx/data';
import "./error";

import "babel-polyfill";


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
      <TimeSeries />
      <ComplexGrid />
      <FormSection/>
      <GridSection/>
      <WindowSection/>
      <ListSection/>
      <MixedModeForm/>
   </div>
</cx>);