import { describe, it } from "vitest";
import { Store } from "../data/Store";
import { Repeater } from "./Repeater";
import { bind } from "./bind";
import { render, settle, markup } from "../util/test/render";
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

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <div>A</div>
               <div>B</div>
               <div>C</div>
            </div>
         `,
      );
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

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <div>B</div>
               <div>C</div>
            </div>
         `,
      );

      divInstances = [];

      await settle(() => store.update("data", (data) => [{ value: "A" }, ...data]));

      assert.equal(
         screen.html(),
         markup`
            <div>
               <div>A</div>
               <div>B</div>
               <div>C</div>
            </div>
         `,
      );

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

interface Item {
   id: number;
   value: string;
}

interface Model {
   records: Item[];
   other: number;
   $record: Item;
}

const m = createAccessorModelProxy<Model>();

describe("Repeater with cached items", () => {
   // the items report their lifecycle, so the tests can tell whether they kept their instances
   function setup() {
      let store = new Store({
         data: {
            records: [
               { id: 1, value: "a" },
               { id: 2, value: "b" },
               { id: 3, value: "c" },
            ],
         },
      });
      let lifecycle = { init: 0, destroy: 0 };
      let widget = (
         <cx>
            <div>
               <Repeater records={m.records} keyField="id" cached>
                  <span text={m.$record.value} onInit={() => lifecycle.init++} onDestroy={() => lifecycle.destroy++} />
               </Repeater>
            </div>
         </cx>
      );
      return { store, widget, lifecycle };
   }

   it("keeps the items of unchanged records when another record changes", async () => {
      let { store, widget, lifecycle } = setup();
      let screen = await render(widget, { store });
      assert.deepEqual(lifecycle, { init: 3, destroy: 0 });

      for (let i = 1; i <= 4; i++)
         await settle(() =>
            store.update(m.records, (records: any[]) => records.map((r) => (r.id == 2 ? { ...r, value: "b" + i } : r))),
         );

      assert.equal(screen.container.textContent, "ab4c");
      assert.deepEqual(lifecycle, { init: 3, destroy: 0 });
   });

   it("destroys the items of removed records", async () => {
      let { store, widget, lifecycle } = setup();
      let screen = await render(widget, { store });

      await settle(() => store.update(m.records, (records: any[]) => records.filter((r) => r.id != 2)));

      assert.equal(screen.container.textContent, "ac");
      assert.deepEqual(lifecycle, { init: 3, destroy: 1 });
   });

   it("updates only the items of changed records", async () => {
      // a function prop is evaluated each time its item is updated
      let evaluated: number[] = [];
      let store = new Store({
         data: {
            other: 0,
            records: [
               { id: 1, value: "a" },
               { id: 2, value: "b" },
               { id: 3, value: "c" },
            ],
         },
      });
      let screen = await render(
         <cx>
            <div>
               <Repeater records={m.records} keyField="id" cached>
                  <span
                     text={(data: any) => {
                        evaluated.push(data.$record.id);
                        return data.$record.value;
                     }}
                  />
               </Repeater>
            </div>
         </cx>,
         { store },
      );
      assert.deepEqual(evaluated, [1, 2, 3]);

      evaluated = [];
      await settle(() => store.set(m.other, 1));
      assert.deepEqual(evaluated, []);

      for (let i = 1; i <= 2; i++)
         await settle(() =>
            store.update(m.records, (records: any[]) => records.map((r) => (r.id == 2 ? { ...r, value: "b" + i } : r))),
         );
      assert.deepEqual(evaluated, [2, 2]);
      assert.equal(screen.container.textContent, "ab2c");
   });
});
