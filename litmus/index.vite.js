import { Widget, startAppLoop, History } from "cx/ui";
import { Timing, Debug } from "cx/util";
import { Store } from "cx/data";
import "./error";

import "./index.scss";

// Vite entry point. Change the import below to test a different demo,
// or keep it in sync with index.js (the webpack entry).
import Demo from "./features/charts/line-graph/SmoothingOvershoot";

let store = (window.store = new Store());

Widget.resetCounter();
Timing.enable("app-loop");
Debug.enable("app-data");

History.connect(store, "url");

let stop;

if (import.meta.hot) {
   import.meta.hot.accept();
   import.meta.hot.dispose((data) => {
      data.state = store.getData();
      if (stop) stop();
   });
   if (import.meta.hot.data?.state) store.load(import.meta.hot.data.state);
}

stop = startAppLoop(document.getElementById("app"), store, Demo);
