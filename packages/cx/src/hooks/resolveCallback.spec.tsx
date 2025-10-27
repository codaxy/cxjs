import assert from "assert";
import { Store } from "../data/Store";
import { createFunctionalComponent } from "../ui/createFunctionalComponent";
import { createTestRenderer } from "../util/test/createTestRenderer";
import { resolveCallback } from "./resolveCallback";

describe("resolveCallback", () => {
   it("works with functions", () => {
      const FComp = createFunctionalComponent(({ onTest }: { onTest: (value: string) => void }) => {
         let callback = resolveCallback(onTest);
         assert(typeof callback === 'function');
         callback("works");
         return (
            <cx>
               <div />
            </cx>
         );
      });

      let store = new Store();
      let value;
      const component = createTestRenderer(store, <cx><FComp onTest={(v: string) => { value = v }} /></cx>);

      component.toJSON();
      assert.equal(value, "works");
   });

   it("works with controller methods", () => {
      const FComp = createFunctionalComponent(({ onTest }: { onTest: string | ((value: string) => void) }) => {
         let callback = resolveCallback(onTest);
         assert(typeof callback === 'function');
         return (
            <cx>
               <div onInit={() => { callback("works"); }} />
            </cx>
         );
      });

      let store = new Store();
      let value;
      const component = createTestRenderer(store, <cx><FComp onTest="onTest" controller={{
         onTest(v: string) { value = v }
      }} /></cx>);

      component.toJSON();
      assert.equal(value, "works");
   });
});
