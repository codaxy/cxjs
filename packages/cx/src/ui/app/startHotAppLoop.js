import { startAppLoop } from "./startAppLoop";
import { Widget } from "../Widget";

export function startHotAppLoop(module, element, store, widgets, options) {
   let stop;
   //webpack (HMR)
   if (module.hot) {
      // accept itself
      module.hot.accept();

      // remember data on dispose
      module.hot.dispose(function (data) {
         data.state = store.getData();
         if (stop) stop();
      });

      //apply data on hot replace
      if (module.hot.data) store.load(module.hot.data.state);
   }

   Widget.resetCounter();

   //app loop
   return (stop = startAppLoop(element, store, widgets, options));
}
