import { describe, it } from "vitest";
import assert from "assert";
import { Store } from "../data/Store";
import { createFunctionalComponent } from "../ui/createFunctionalComponent";
import { render } from "../util/test/render";
import { resolveCallback } from "./resolveCallback";

describe("resolveCallback", () => {
   it("works with functions", async () => {
      const FComp = createFunctionalComponent(({ onTest }: { onTest: (value: string) => void }) => {
         let callback = resolveCallback(onTest);
         assert(typeof callback === "function");
         callback("works");
         return (
            <cx>
               <div />
            </cx>
         );
      });

      let store = new Store();
      let value;
      await render(
         <cx>
            <FComp
               onTest={(v: string) => {
                  value = v;
               }}
            />
         </cx>,
         { store },
      );
      assert.equal(value, "works");
   });

   it("works with controller methods", async () => {
      const FComp = createFunctionalComponent(({ onTest }: { onTest: string | ((value: string) => void) }) => {
         let callback = resolveCallback(onTest);
         assert(typeof callback === "function");
         return (
            <cx>
               <div
                  onInit={() => {
                     callback("works");
                  }}
               />
            </cx>
         );
      });

      let store = new Store();
      let value;
      await render(
         <cx>
            <FComp
               onTest="onTest"
               controller={{
                  onTest(v: string) {
                     value = v;
                  },
               }}
            />
         </cx>,
         { store },
      );
      assert.equal(value, "works");
   });
});
