import { startAppLoop } from "./startAppLoop";
import { Widget } from "../Widget";

export function startHotAppLoop(appModule, element, store, widgets, options) {
   let stop;
   //webpack (HMR)
   if (appModule.hot) {
      // accept itself
      appModule.hot.accept();

      // remember data on dispose
      appModule.hot.dispose(function (data) {
         data.state = store.getData();
         if (stop) stop();
      });

      //apply data on hot replace
      if (appModule.hot.data) store.load(appModule.hot.data.state);
   }

   Widget.resetCounter();

   //app loop
   return (stop = startAppLoop(element, store, widgets, options));
}
