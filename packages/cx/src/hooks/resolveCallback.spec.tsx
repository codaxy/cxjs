//@ts-nocheck
import assert from "assert";
import renderer from "react-test-renderer";
import { Store } from "../data/Store";
import { createFunctionalComponent } from "../ui/createFunctionalComponent";
import { Cx } from "../ui/Cx";
import { resolveCallback } from "./resolveCallback";

describe("resolveCallback", () => {
   it("works with functions", () => {
      const FComp = createFunctionalComponent(({ onTest }) => {
         let callback = resolveCallback(onTest);
         callback("works");
         return (
            <cx>
               <div />
            </cx>
         );
      });

      let store = new Store();
      let value;
      const component = renderer.create(<Cx widget={{ type: FComp, onTest: v => { value = v } }} store={store} subscribe immediate />);

      component.toJSON();
      assert.equal(value, "works");
   });

   it("works with controller methods", () => {
      const FComp = createFunctionalComponent(({ onTest }) => {
         let callback = resolveCallback(onTest);
         return (
            <cx>
               <div onInit={() => { callback("works"); }} />
            </cx>
         );
      });

      let store = new Store();
      let value;
      const component = renderer.create(<Cx widget={{
         type: FComp,
         onTest: "onTest",
         controller: {
            onTest(v) { value = v }
         }
      }} store={store} subscribe immediate />);

      component.toJSON();
      assert.equal(value, "works");
   });
});
