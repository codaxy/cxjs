import { Store } from "../data/Store";
import { createTestRenderer, act } from "../util/test/createTestRenderer";
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

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(list, ["bad"]);
      assert.deepEqual(tree, {
         type: "span",
         props: {},
         children: ["bad"],
      });

      //component should not re-render if unrelated data changes
      await act(async () => {
         store.set("dummy", "dummy");
      });
      tree = component.toJSON();
      assert.deepEqual(list, ["bad"]);

      //component should not re-render if unrelated data changes
      await act(async () => {
         store.set("value", "good");
      });
      tree = component.toJSON();
      assert.deepEqual(list, ["bad", "good"]);
      assert.deepEqual(tree, {
         type: "span",
         props: {},
         children: ["good"],
      });
   });
});
