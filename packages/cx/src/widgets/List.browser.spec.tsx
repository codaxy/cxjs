import { describe, it } from "vitest";
import assert from "assert";
import { createModel } from "../data/createAccessorModelProxy";
import { Store } from "../data/Store";
import { List } from "./List";
import { render, settle, RenderResult } from "../util/test/render";

interface Item {
   id: number;
   value: string;
}

interface Model {
   records: Item[];
   $record: Item;
}

const m = createModel<Model>();

function getItemTexts(screen: RenderResult): string[] {
   return Array.from(screen.container.querySelectorAll("li")).map((li) => li.textContent ?? "");
}

describe("List with cached items", () => {
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
            <List records={m.records} keyField="id" cached>
               <span text={m.$record.value} onInit={() => lifecycle.init++} onDestroy={() => lifecycle.destroy++} />
            </List>
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

      assert.deepEqual(getItemTexts(screen), ["a", "b4", "c"]);
      assert.deepEqual(lifecycle, { init: 3, destroy: 0 });
   });

   it("destroys the items of removed records", async () => {
      let { store, widget, lifecycle } = setup();
      let screen = await render(widget, { store });

      await settle(() => store.update(m.records, (records: any[]) => records.filter((r) => r.id != 2)));

      assert.deepEqual(getItemTexts(screen), ["a", "c"]);
      assert.deepEqual(lifecycle, { init: 3, destroy: 1 });
   });
});
