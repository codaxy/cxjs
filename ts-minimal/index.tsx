import { Store } from "cx/data";
import { bind, CSS, CSSHelper, History, startHotAppLoop, Widget } from "cx/ui";
import { Debug, Timing } from "cx/util";
import { TextField } from "cx/widgets";

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
   <cx>
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
         {/* there is no error for abc, because TextField has //@ts-nocheck */}
         <TextField value={bind("nesto")} />
         {/* <TextField value={bind("nesto")} /> */}

         <div text={bind("nesto")} style="color: red" />
      </div>
   </cx>,
);
