import { Store } from "cx/data";
import "cx/locale/de-de.js";
import {
  Culture,
  enableCultureSensitiveFormatting,
  History,
  Widget,
} from "cx/ui";
import { startHotAppLoop } from "cx/ui/app/startHotAppLoop.js";
import { Debug, Timing } from "cx/util";
import { enableMsgBoxAlerts, enableTooltips } from "cx/widgets";
import test from "./bugs/DateTimePickerInfinite";

let store = new Store();

Widget.resetCounter();
//Widget.optimizePrepare = false;
//Widget.prototype.memoize = false;
//Timing.enable('vdom-render');
Timing.enable("app-loop");
Debug.enable("app-data");
enableCultureSensitiveFormatting();

enableTooltips();
enableMsgBoxAlerts();

History.connect(store, "url");

Culture.setCulture("sr-latn");

// @ts-expect-error
startHotAppLoop(module, document.getElementById("app"), store, test);
