import { Store } from "cx/data";
import { bind, History, startHotAppLoop, Widget } from "cx/ui";
import { Debug, Timing } from "cx/util";
import { Restate, TextField, ValidationGroup, Validator } from "cx/widgets";
import { TestWidget } from "./TestWidget";

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
            //console.log("Mouse moved", e, instance);
         }}
         controller={{
            onInit() {
               console.log("Controller initialized");
            },
         }}
      >
         <h1>TypeScript Minimal Example</h1>
         <p>This is a minimal example of a Cx application using TypeScript.</p>
         <p>Check the console for debug information.</p>
         <ValidationGroup valid={bind("test")}>
            <TextField value={bind("nesto")} required />
         </ValidationGroup>
         <div text={bind("nesto")} style="color: red" />
         <div visible={bind("test")}>Valid</div>
         <Restate data={{ x: bind("nesto") }}>
            <div text={bind("x")} />
         </Restate>
         <TestWidget />
      </div>
   </cx>,
);
