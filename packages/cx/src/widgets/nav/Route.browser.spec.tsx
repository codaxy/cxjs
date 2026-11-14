import { describe, it } from "vitest";
import { Route } from "./Route";
import { Store } from "../../data/Store";
import { render } from "../../util/test/render";
import assert from "assert";

describe("Route", () => {
   it("matching works for ~/widgets/color-pickers", async () => {
      let widget = (
         <cx>
            <Route url="~/widgets/color-pickers" route="~/widgets/color-pickers">
               <div />
            </Route>
         </cx>
      );

      let store = new Store();

      const screen = await render(widget, { store });

      assert.equal(screen.html(), "<div></div>");
   });
});
