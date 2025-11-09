import { Route } from "./Route";
import { Store } from "../../data/Store";
import { createTestRenderer } from "../../util/test/createTestRenderer";
import assert from "assert";

describe("Route", () => {
   it("matching works for ~/widgets/color-pickers", () => {
      let widget = (
         <cx>
            <Route url="~/widgets/color-pickers" route="~/widgets/color-pickers">
               <div />
            </Route>
         </cx>
      );

      let store = new Store();

      const component = createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree));
      assert.equal(tree.type, "div");
   });
});
