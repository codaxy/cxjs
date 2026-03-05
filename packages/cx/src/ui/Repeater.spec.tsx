import { Store } from "../data/Store";
import { Repeater } from "./Repeater";
import { bind } from "./bind";
import { createTestRenderer, act } from "../util/test/createTestRenderer";
import { createAccessorModelProxy } from "../data/createAccessorModelProxy";

import assert from "assert";

describe("Repeater", () => {
   it("allows sorting", async () => {
      let data = [
         {
            value: "C",
         },
         {
            value: "B",
         },
         {
            value: "A",
         },
      ];

      let widget = (
         <cx>
            <div>
               <Repeater records={data} sorters={[{ field: "value", direction: "ASC" }]} recordAlias="$item">
                  <div text={bind("$item.value")} />
               </Repeater>
            </div>
         </cx>
      );

      let store = new Store();

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "div",
               props: {},
               children: ["A"],
            },
            {
               type: "div",
               props: {},
               children: ["B"],
            },
            {
               type: "div",
               props: {},
               children: ["C"],
            },
         ],
      });
   });

   it("changes are properly updated", async () => {
      let divInstances: any[] = [];
      let widget = (
         <cx>
            <div>
               <Repeater records={bind("data")} sorters={[{ field: "value", direction: "ASC" }]} recordAlias="$item">
                  <div
                     text={bind("$item.value")}
                     onExplore={(context, instance) => {
                        divInstances.push(instance);
                     }}
                  />
               </Repeater>
            </div>
         </cx>
      );

      let store = new Store({
         data: {
            data: [
               {
                  value: "C",
               },
               {
                  value: "B",
               },
            ],
         },
      });

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "div",
               props: {},
               children: ["B"],
            },
            {
               type: "div",
               props: {},
               children: ["C"],
            },
         ],
      });

      divInstances = [];

      await act(async () => {
         store.update("data", (data) => [{ value: "A" }, ...data]);
      });

      assert.deepEqual(component.toJSON(), {
         type: "div",
         props: {},
         children: [
            {
               type: "div",
               props: {},
               children: ["A"],
            },
            {
               type: "div",
               props: {},
               children: ["B"],
            },
            {
               type: "div",
               props: {},
               children: ["C"],
            },
         ],
      });

      assert.equal(divInstances.length, 3);
      assert.equal(divInstances[0].store.get("$item.value"), "A");
      assert.equal(divInstances[1].store.get("$item.value"), "B");
      assert.equal(divInstances[2].store.get("$item.value"), "C");
   });

   it("infers T from AccessorChain<T[]> for onCreateFilter callback", () => {
      interface Item {
         name: string;
         active: boolean;
      }

      interface AppModel {
         items: Item[];
         $item: Item;
      }

      const m = createAccessorModelProxy<AppModel>();

      // onCreateFilter should receive (record: Item) => boolean when T is inferred from AccessorChain<Item[]>
      const widget = (
         <cx>
            <div>
               <Repeater
                  records={m.items}
                  recordAlias={m.$item}
                  onCreateFilter={() => (record) => {
                     // If T is correctly inferred as Item, record.name should be string
                     const name: string = record.name;
                     // @ts-expect-error - record.name should be string, not number
                     const wrong: number = record.name;
                     return record.active;
                  }}
               >
                  <div text={m.$item.name} />
               </Repeater>
            </div>
         </cx>
      );

      assert.ok(widget);
   });
});
