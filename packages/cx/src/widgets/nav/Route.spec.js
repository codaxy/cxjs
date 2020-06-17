import { Cx } from "../../ui/Cx";
import { VDOM } from "../../ui/VDOM";
import { Route } from "./Route";
import { Store } from "../../data/Store";
import { HtmlElement } from "../HtmlElement";

import renderer from "react-test-renderer";
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

      const component = renderer.create(<Cx widget={widget} store={store} />);

      let tree = component.toJSON();
      assert.equal(tree.type, "div");
   });
});
