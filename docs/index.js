import { enableCultureSensitiveFormatting, History, startHotAppLoop, Url } from "cx/ui";
import { Debug, Timing } from "cx/util";
import { enableTooltips } from "cx/widgets";
import "./app/icons";
import { Main } from "./app/Main";
import { store } from "./app/store";
import "./index.scss";
import "cx-theme-aquamarine";

enableTooltips();
enableCultureSensitiveFormatting();

let stop,
   start = () => {
      Url.setBaseFromScript("~/app*.js");
      History.connect(store, "url", "hash");
      Timing.enable("app-loop");
      //Timing.enable('vdom-render');
      Debug.enable("app-data");
      //Widget.lazyInit = false;
      //Widget.optimizePrepare = false;
      //Debug.enable('process-data');
      //Debug.enable('should-update');
      stop = startHotAppLoop(module, document.getElementById("app"), store, Main);
   };

if (Object.assign && window.fetch && window.WeakMap && window.Intl) start();
else {
   import(/* webpackChunkName: "polyfill" */ "./polyfill").then(start).catch((error) => {
      console.error(error);
   });
}
