import { Store } from "cx/data";
import "cx/locale/de-de.js";
import { History, Widget } from "cx/ui";
import { startHotAppLoop } from "cx/ui/app/startHotAppLoop.js";
import { Debug, Timing } from "cx/util";
import { enableMsgBoxAlerts, enableTooltips } from "cx/widgets";
import Demo from "./bugs/GridOnFetchRecords";

let store = new Store();

Widget.resetCounter();
//Widget.optimizePrepare = false;
//Widget.prototype.memoize = false;
//Timing.enable('vdom-render');
Timing.enable("app-loop");
Debug.enable("app-data");

enableTooltips();
enableMsgBoxAlerts();

History.connect(store, "url");

startHotAppLoop(
   module,
   document.getElementById("app"),
   store,
   <cx>

      <Demo />
   </cx>,
);
