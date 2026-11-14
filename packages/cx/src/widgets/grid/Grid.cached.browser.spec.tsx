import { describe, it } from "vitest";
import assert from "assert";
import { Store } from "../../data/Store";
import { bind } from "../../ui/bind";
import { Grid } from "./Grid";
import { render, settle, RenderResult } from "../../util/test/render";

function getCellTexts(screen: RenderResult): string[] {
   return Array.from(screen.container.querySelectorAll("tbody td")).map((td) => td.textContent ?? "");
}

// The content of each row reports its lifecycle, so the tests can tell whether
// the rows kept their instances or were destroyed and created again.
function setup() {
   let store = new Store({
      data: {
         title: "Value",
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
         <Grid
            cached
            keyField="id"
            records={bind("records")}
            columns={[
               {
                  header: { text: bind("title") },
                  field: "value",
                  children: (
                     <cx>
                        <span
                           text={bind("$record.value")}
                           onInit={() => lifecycle.init++}
                           onDestroy={() => lifecycle.destroy++}
                        />
                     </cx>
                  ),
               },
            ]}
         />
      </cx>
   );
   return { store, widget, lifecycle };
}

function changeRecord(store: Store, id: number, value: string) {
   store.update("records", (records: any[]) => records.map((r) => (r.id == id ? { ...r, value } : r)));
}

describe("Grid with cached rows", () => {
   it("keeps the rows of unchanged records when another record changes", async () => {
      let { store, widget, lifecycle } = setup();
      let screen = await render(widget, { store });
      assert.deepEqual(lifecycle, { init: 3, destroy: 0 });

      for (let i = 1; i <= 4; i++) await settle(() => changeRecord(store, 2, "b" + i));

      assert.deepEqual(getCellTexts(screen), ["a", "b4", "c"]);
      assert.deepEqual(lifecycle, { init: 3, destroy: 0 });
   });

   it("keeps the rows when only the header changes", async () => {
      let { store, widget, lifecycle } = setup();
      let screen = await render(widget, { store });

      await settle(() => store.set("title", "Name"));
      assert.equal(screen.container.querySelector("thead th")?.textContent, "Name");

      await settle(() => changeRecord(store, 2, "x"));
      assert.deepEqual(getCellTexts(screen), ["a", "x", "c"]);
      assert.deepEqual(lifecycle, { init: 3, destroy: 0 });
   });

   it("destroys the rows of removed records", async () => {
      let { store, widget, lifecycle } = setup();
      let screen = await render(widget, { store });

      await settle(() => store.update("records", (records: any[]) => records.filter((r) => r.id != 2)));

      assert.deepEqual(getCellTexts(screen), ["a", "c"]);
      assert.deepEqual(lifecycle, { init: 3, destroy: 1 });
   });
});
