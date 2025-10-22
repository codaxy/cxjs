import { startAppLoop, StartAppLoopOptions } from "./startAppLoop";
import { Widget } from "../Widget";
import { Store } from "../../data/Store";

export interface HotModule {
   hot?: {
      accept: () => void;
      dispose: (callback: (data: any) => void) => void;
      data?: any;
   };
}

export function startHotAppLoop(
   appModule: HotModule,
   element: HTMLElement,
   store: Store,
   widgets: typeof Widget,
   options: StartAppLoopOptions = {},
): () => void {
   let stop: (() => void) | undefined;
   //webpack (HMR)
   if (appModule.hot) {
      // accept itself
      appModule.hot.accept();

      // remember data on dispose
      appModule.hot.dispose(function (data: any) {
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
