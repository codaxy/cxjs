import assert from "assert";
import { Store } from "../data/Store";
import { createFunctionalComponent } from "../ui/createFunctionalComponent";
import { createTestRenderer } from "../util/test/createTestRenderer";
import { invokeCallback } from "./invokeCallback";

describe("invokeCallback", () => {
   it("works with functions", () => {
      const FComp = createFunctionalComponent(({ onTest }: { onTest: (v: any) => void }) => {
         invokeCallback(null!, onTest, "works");
         return (
            <cx>
               <div />
            </cx>
         );
      });

      let store = new Store();
      let value;
      const component = createTestRenderer(store, {
         type: FComp,
         onTest: (v: any) => {
            value = v;
         },
      });

      component.toJSON();
      assert.equal(value, "works");
   });

   it("works with controller methods", () => {
      const FComp = createFunctionalComponent(({ onTest }: { onTest: (v: any) => void }) => {
         return (
            <cx>
               <div
                  onExplore={(context, instance) => {
                     invokeCallback(instance, onTest, "works");
                  }}
               />
            </cx>
         );
      });

      let store = new Store();
      let value;
      const component = createTestRenderer(store, {
         type: FComp,
         onTest: "onTest",
         controller: {
            onTest(v: any) {
               value = v;
            },
         },
      });

      component.toJSON();
      assert.equal(value, "works");
   });
});
