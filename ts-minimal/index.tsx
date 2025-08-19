import { Widget, startAppLoop, History, startHotAppLoop, bind } from "cx/ui";
//import { HtmlElement } from 'cx/widgets';
import { Timing, Debug } from "cx/util";
import { Store } from "cx/data";
import { TextField } from "cx/widgets";

let store = new Store();

Widget.resetCounter();
//Widget.optimizePrepare = false;
//Widget.prototype.memoize = false;
//Timing.enable('vdom-render');
Timing.enable("app-loop");
Debug.enable("app-data");

History.connect(store, "url");

startHotAppLoop(
   module,
   document.getElementById("app"),
   store,
   <div>
      <h1>TypeScript Minimal Example</h1>
      <p>This is a minimal example of a Cx application using TypeScript.</p>
      <p>Check the console for debug information.</p>
      <TextField value={bind("nesto")} />
      <TextField value={bind("nesto")} />
   </div>,
);
