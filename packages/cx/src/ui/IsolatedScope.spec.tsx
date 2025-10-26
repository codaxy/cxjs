import { Cx } from "./Cx";
import { Store } from "../data/Store";
import renderer from "react-test-renderer";
import assert from "assert";
import { IsolatedScope } from "./IsolatedScope";
import { bind } from "./bind";

describe("IsolatedScope", () => {
   it("prevents multiple re-renders", () => {
      let list = [];
      let widget = (
         <cx>
            <IsolatedScope
               data={{
                  value: { bind: 'value' }
               }}
            >
               <span text={bind("value")} onExplore={(context, { store }) => {
                  list.push(store.get("value"));
               }} />
            </IsolatedScope>
         </cx>
      );

      let store = new Store({
         data: {
            value: "bad",
         },
      });

      const component = renderer.create(<Cx widget={widget} store={store} subscribe immediate />);

      let tree = component.toJSON();
      assert.deepEqual(list, ["bad"]);
      assert.deepEqual(tree, {
         type: "span",
         props: {},
         children: ["bad"],
      });

      //component should not re-render if unrelated data changes
      store.set("dummy", "dummy");
      tree = component.toJSON();
      assert.deepEqual(list, ["bad"]);

      //component should not re-render if unrelated data changes
      store.set("value", "good");
      tree = component.toJSON();
      assert.deepEqual(list, ["bad", "good"]);
      assert.deepEqual(tree, {
         type: "span",
         props: {},
         children: ["good"],
      });
   });
});
