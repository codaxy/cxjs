import { describe, it } from "vitest";
import { userEvent } from "vitest/browser";
import assert from "assert";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { KeySelection } from "../../ui/selection/KeySelection";
import { Grid, GridConfig } from "./Grid";
import { render, settle, RenderResult } from "../../util/test/render";

interface Person {
   id: number;
   name: string;
   group: string;
}

interface Model {
   records: Person[];
   selection: number | number[];
   $record: Person;
}

const m = createModel<Model>();

function setup(gridProps: Partial<GridConfig> = {}) {
   let store = new Store({
      data: { records: [1, 2, 3, 4, 5].map((id) => ({ id, name: "Name " + id, group: id <= 3 ? "A" : "B" })) },
   });
   let widget = (
      <cx>
         <Grid
            records={m.records}
            keyField="id"
            selection={{ type: KeySelection, bind: m.selection, multiple: true }}
            columns={[{ header: "Name", field: "name" }]}
            {...gridProps}
         />
      </cx>
   );
   return { store, widget };
}

// rows are rendered as one tbody per record
function rowElement(screen: RenderResult, id: number) {
   return screen.container.querySelector(`tbody[data-record-key="${id}"]`)!;
}

function rowsWithClass(screen: RenderResult, className: string) {
   return Array.from(screen.container.querySelectorAll(`tbody.cxe-grid-data.${className}`)).map((t) =>
      Number(t.getAttribute("data-record-key")),
   );
}

async function click(screen: RenderResult, text: string, modifiers?: ("Control" | "Shift")[]) {
   let element = screen.getByText(text, { exact: true }).element();
   await settle(() => (modifiers ? userEvent.click(element, { modifiers } as any) : userEvent.click(element)));
}

async function press(keys: string) {
   await settle(() => userEvent.keyboard(keys));
}

describe("Grid selection", () => {
   it("selects the clicked row and marks it as selected and as the cursor", async () => {
      let { store, widget } = setup();
      let screen = await render(widget, { store });

      await click(screen, "Name 2");

      assert.deepEqual(store.get(m.selection), [2]);
      assert.deepEqual(rowsWithClass(screen, "cxs-selected"), [2]);
      assert.deepEqual(rowsWithClass(screen, "cxs-cursor"), [2]);
   });

   it("renders the selection from the store", async () => {
      let { store, widget } = setup();
      store.set(m.selection, [3, 5]);
      let screen = await render(widget, { store });

      assert.deepEqual(rowsWithClass(screen, "cxs-selected"), [3, 5]);

      await settle(() => store.set(m.selection, [1]));
      assert.deepEqual(rowsWithClass(screen, "cxs-selected"), [1]);
   });

   it("replaces the selection on click, toggles on ctrl+click and selects a range on shift+click", async () => {
      let { store, widget } = setup();
      let screen = await render(widget, { store });

      await click(screen, "Name 2");
      await click(screen, "Name 4");
      assert.deepEqual(store.get(m.selection), [4]);

      await click(screen, "Name 1", ["Control"]);
      assert.deepEqual(store.get(m.selection), [4, 1]);

      await click(screen, "Name 4", ["Control"]);
      assert.deepEqual(store.get(m.selection), [1]);

      // the range starts at the last clicked row, even if that click deselected it, and replaces the selection
      await click(screen, "Name 3", ["Shift"]);
      assert.deepEqual(store.get(m.selection), [3, 4]);

      await click(screen, "Name 1", ["Control"]);
      await click(screen, "Name 3", ["Shift"]);
      assert.deepEqual(store.get(m.selection), [1, 2, 3]);
   });

   it("selects a single record if the selection is not multiple", async () => {
      let { store, widget } = setup({ selection: { type: KeySelection, bind: m.selection } });
      let screen = await render(widget, { store });

      await click(screen, "Name 2");
      assert.equal(store.get(m.selection), 2);

      await click(screen, "Name 4", ["Control"]);
      assert.equal(store.get(m.selection), 4);
   });

   it("calls onRowClick and onRowDoubleClick with the row instance", async () => {
      let clicked: any[] = [];
      let doubleClicked: any[] = [];
      let { store, widget } = setup({
         onRowClick: (e, instance) => clicked.push(instance.store.get(m.$record.id)),
         onRowDoubleClick: (e, instance) => doubleClicked.push(instance.store.get(m.$record.id)),
      });
      let screen = await render(widget, { store });

      await click(screen, "Name 3");
      await settle(() => userEvent.dblClick(screen.getByText("Name 5", { exact: true }).element()));

      assert.deepEqual(clicked, [3, 5, 5]);
      assert.deepEqual(doubleClicked, [5]);
   });
});

describe("Grid keyboard navigation", () => {
   it("moves the cursor with the arrow keys without changing the selection", async () => {
      let { store, widget } = setup();
      let screen = await render(widget, { store });

      await click(screen, "Name 2");
      await press("{ArrowDown}");
      await press("{ArrowDown}");
      assert.deepEqual(rowsWithClass(screen, "cxs-cursor"), [4]);
      assert.deepEqual(store.get(m.selection), [2]);

      await press("{ArrowUp}");
      assert.deepEqual(rowsWithClass(screen, "cxs-cursor"), [3]);
   });

   it("stops the cursor at the first and the last row", async () => {
      let { store, widget } = setup();
      let screen = await render(widget, { store });

      await click(screen, "Name 1");
      await press("{ArrowUp}");
      assert.deepEqual(rowsWithClass(screen, "cxs-cursor"), [1]);

      await click(screen, "Name 5");
      await press("{ArrowDown}");
      assert.deepEqual(rowsWithClass(screen, "cxs-cursor"), [5]);
   });

   it("extends the selection with shift and the arrow keys", async () => {
      let { store, widget } = setup();
      let screen = await render(widget, { store });

      await click(screen, "Name 2");
      await press("{Shift>}{ArrowDown}{ArrowDown}{/Shift}");
      assert.deepEqual(store.get(m.selection), [2, 3, 4]);
      assert.deepEqual(rowsWithClass(screen, "cxs-selected"), [2, 3, 4]);

      await press("{Shift>}{ArrowUp}{/Shift}");
      assert.deepEqual(store.get(m.selection), [2, 3]);
   });

   it("selects the cursor row with enter and toggles it with ctrl+enter", async () => {
      let { store, widget } = setup();
      let screen = await render(widget, { store });

      await click(screen, "Name 1");
      await press("{ArrowDown}{Enter}");
      assert.deepEqual(store.get(m.selection), [2]);

      await press("{ArrowDown}{Control>}{Enter}{/Control}");
      assert.deepEqual(store.get(m.selection), [2, 3]);

      await press("{Control>}{Enter}{/Control}");
      assert.deepEqual(store.get(m.selection), [2]);
   });

   it("selects all records with ctrl+a", async () => {
      let { store, widget } = setup();
      let screen = await render(widget, { store });

      await click(screen, "Name 2");
      await press("{Control>}a{/Control}");
      assert.deepEqual(store.get(m.selection), [1, 2, 3, 4, 5]);
   });

   it("skips group rows", async () => {
      let { store, widget } = setup({ grouping: ["group"] });
      let screen = await render(widget, { store });

      await click(screen, "Name 3");
      await press("{ArrowDown}");
      assert.deepEqual(rowsWithClass(screen, "cxs-cursor"), [4]);

      await press("{ArrowUp}");
      assert.deepEqual(rowsWithClass(screen, "cxs-cursor"), [3]);
   });

   it("calls onRowKeyDown with the instance of the cursor row", async () => {
      let keys: string[] = [];
      let { store, widget } = setup({
         onRowKeyDown: (e: any, instance) => {
            keys.push(e.key + ":" + instance.store.get(m.$record.id));
         },
      });
      let screen = await render(widget, { store });

      await click(screen, "Name 2");
      await press("{ArrowDown}x");
      assert.deepEqual(keys, ["ArrowDown:2", "x:3"]);
   });

   it("removes the cursor when the grid loses focus", async () => {
      let { store, widget } = setup();
      let screen = await render(widget, { store });

      await click(screen, "Name 2");
      assert.ok(rowElement(screen, 2).classList.contains("cxs-cursor"));

      let input = document.createElement("input");
      document.body.appendChild(input);
      await settle(() => input.focus());
      // the focus-out handling is asynchronous
      await new Promise((resolve) => setTimeout(resolve, 50));
      await settle();

      assert.deepEqual(rowsWithClass(screen, "cxs-cursor"), []);
      assert.deepEqual(store.get(m.selection), [2]);
      input.remove();
   });
});
