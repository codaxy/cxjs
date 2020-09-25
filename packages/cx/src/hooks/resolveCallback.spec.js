import { useTrigger } from "./useTrigger";
import { createFunctionalComponent } from "../ui/createFunctionalComponent";
import { Store } from "../data/Store";
import renderer from "react-test-renderer";
import { HtmlElement } from "../widgets/HtmlElement";
import { VDOM } from "../ui/VDOM";
import { Cx } from "../ui/Cx";
import assert from "assert";
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
