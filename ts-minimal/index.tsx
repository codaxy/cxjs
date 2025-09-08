import { Widget, startAppLoop, History, startHotAppLoop, bind, Controller } from "cxts/ui";
//import { HtmlElement } from 'cx/widgets';
import { Timing, Debug } from "cxts/util";
import { Store } from "cxts/data";
import { TextField } from "cxts/src/widgets/form/TextField";
import { CSS } from "cxts/ui";
import { CSSHelper } from "cxts/src/ui";

CSSHelper.register("cx", CSS);

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
   <div
      onMouseMove={(e, instance) => {
         // console.log("Mouse moved", e, instance);
      }}
      controller={{
         onInit() {
            console.log("Controller initialized");
         },
      }}
   >
      <h1>TypeScript Minimal Example</h1>
      <p>This is a minimal example of a Cx application using TypeScript.</p>
      <p>Check the console for1 debug information.</p>
      <TextField value={bind("nesto")} />
      <TextField value={bind("nesto")} />

      <div text={bind("nesto")} style="color: red" />
   </div>,
);
