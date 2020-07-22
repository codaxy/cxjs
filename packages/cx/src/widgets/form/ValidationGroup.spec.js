import { Cx } from "../../ui/Cx";
import { VDOM } from "../../ui/VDOM";
import { Store } from "../../data/Store";
import { HtmlElement } from "../HtmlElement";
import { ValidationGroup } from "./ValidationGroup";
import { Validator } from "./Validator";

import renderer from "react-test-renderer";
import assert from "assert";

describe("ValidationGroup", () => {
   it("performs validation and sets the flags", () => {
      let widget = (
         <cx>
            <ValidationGroup invalid-bind="invalid" valid-bind="valid">
               <Validator onValidate={() => "Something is wrong..."} />
               <div visible-bind="invalid">Invalid</div>
            </ValidationGroup>
         </cx>
      );

      let store = new Store();

      const component = renderer.create(<Cx widget={widget} store={store} subscribe />);

      let tree = component.toJSON();
      assert.equal(tree.type, "div");
      assert.equal(store.get("invalid"), true);
      assert.equal(store.get("valid"), false);
   });

   it("nested validation works", () => {
      let widget = (
         <cx>
            <div>
               <ValidationGroup invalid-bind="invalid">
                  <ValidationGroup invalid-bind="invalid1">
                     <Validator onValidate={() => "Something is wrong..."} />
                  </ValidationGroup>
                  <ValidationGroup invalid-bind="invalid2">
                     <Validator onValidate={() => false} />
                  </ValidationGroup>
               </ValidationGroup>
            </div>
         </cx>
      );

      let store = new Store();

      const component = renderer.create(<Cx widget={widget} store={store} subscribe />);

      let tree = component.toJSON();
      assert.equal(store.get("invalid"), true);
      assert.equal(store.get("invalid1"), true);
      assert.equal(store.get("invalid2"), false);
   });

   it("isolated validation group does not affect the parent", () => {
      let widget = (
         <cx>
            <div>
               <ValidationGroup invalid-bind="invalid">
                  <ValidationGroup invalid-bind="invalid1" isolated>
                     <Validator onValidate={() => "Something is wrong..."} />
                  </ValidationGroup>
                  <ValidationGroup invalid-bind="invalid2">
                     <Validator onValidate={() => false} />
                  </ValidationGroup>
               </ValidationGroup>
            </div>
         </cx>
      );

      let store = new Store();

      const component = renderer.create(<Cx widget={widget} store={store} subscribe />);

      let tree = component.toJSON();
      assert.equal(store.get("invalid"), false);
      assert.equal(store.get("invalid1"), true);
      assert.equal(store.get("invalid2"), false);
   });

   it("visited flag is propagated into nested validation groups", () => {
      let visited = false;

      let widget = (
         <cx>
            <div>
               <ValidationGroup visited>
                  <ValidationGroup>
                     <div
                        onExplore={(context, instance) => {
                           if (context.parentVisited) visited = true;
                        }}
                     />
                  </ValidationGroup>
               </ValidationGroup>
            </div>
         </cx>
      );

      let store = new Store();

      const component = renderer.create(<Cx widget={widget} store={store} subscribe />);

      let tree = component.toJSON();
      assert(visited);
   });
});
