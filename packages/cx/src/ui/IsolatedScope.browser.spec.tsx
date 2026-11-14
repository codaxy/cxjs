import { describe, it } from "vitest";
import { Store } from "../data/Store";
import { render, settle } from "../util/test/render";
import assert from "assert";
import { IsolatedScope } from "./IsolatedScope";
import { bind } from "./bind";

describe("IsolatedScope", () => {
   it("prevents multiple re-renders", async () => {
      let list: any[] = [];
      let widget = (
         <cx>
            <IsolatedScope
               data={{
                  value: { bind: "value" },
               }}
            >
               <span
                  text={bind("value")}
                  onExplore={(context, { store }) => {
                     list.push(store.get("value"));
                  }}
               />
            </IsolatedScope>
         </cx>
      );

      let store = new Store({
         data: {
            value: "bad",
         },
      });

      const screen = await render(widget, { store });

      assert.deepEqual(list, ["bad"]);
      assert.equal(screen.html(), "<span>bad</span>");

      //component should not re-render if unrelated data changes
      await settle(() => store.set("dummy", "dummy"));
      assert.deepEqual(list, ["bad"]);

      //component should not re-render if unrelated data changes
      await settle(() => store.set("value", "good"));
      assert.deepEqual(list, ["bad", "good"]);
      assert.equal(screen.html(), "<span>good</span>");
   });
});
