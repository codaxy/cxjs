import { describe, it } from "vitest";
import assert from "assert";
import { Store } from "../data/Store";
import { createFunctionalComponent } from "../ui/createFunctionalComponent";
import { render } from "../util/test/render";
import { invokeCallback } from "./invokeCallback";

describe("invokeCallback", () => {
   it("works with functions", async () => {
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
      await render(
         {
            type: FComp,
            onTest: (v: any) => {
               value = v;
            },
         },
         { store },
      );
      assert.equal(value, "works");
   });

   it("works with controller methods", async () => {
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
      await render(
         {
            type: FComp,
            onTest: "onTest",
            controller: {
               onTest(v: any) {
                  value = v;
               },
            },
         },
         { store },
      );
      assert.equal(value, "works");
   });
});
