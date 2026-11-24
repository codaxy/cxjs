// Row state that does not come from the content of the row: classes and handlers that depend on the position of the
// row, on callbacks of the grid, or on a drag in progress. They must follow changes that leave the content of the
// row as it was, e.g. when sorting moves rows or when a record changes in a field that is not shown.
import "../../index.scss";
import { describe, expect, it } from "vitest";
import { commands, userEvent } from "vitest/browser";
import assert from "assert";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { KeySelection } from "../../ui/selection/KeySelection";
import { Grid, GridConfig } from "./Grid";
import { render, settle, RenderResult } from "../../util/test/render";

interface Person {
   id: number;
   name: string;
   locked?: boolean;
}

interface Model {
   records: Person[];
   selection: number;
   sortField: string;
   sortDirection: string;
}

const m = createModel<Model>();

// sorted by name, the records come in the order 2, 3, 1, 4, 5; record 1 moves by two positions
const people: Person[] = [
   { id: 1, name: "C" },
   { id: 2, name: "A" },
   { id: 3, name: "B" },
   { id: 4, name: "D" },
   { id: 5, name: "E" },
];

async function setup(gridProps: Partial<GridConfig> = {}) {
   let store = new Store({ data: { records: people } });
   let screen = await render(
      <cx>
         <Grid
            records={m.records}
            keyField="id"
            sortField={m.sortField}
            sortDirection={m.sortDirection}
            columns={[{ header: "Name", field: "name" }]}
            {...gridProps}
         />
      </cx>,
      { store },
   );
   return { store, screen };
}

function rowElement(screen: RenderResult, id: number) {
   let tbody = screen.container.querySelector(`tbody[data-record-key="${id}"]`);
   assert.ok(tbody, `row ${id} not found`);
   return tbody;
}

function rowIds(screen: RenderResult) {
   return Array.from(screen.container.querySelectorAll("tbody.cxe-grid-data")).map((t) =>
      Number(t.getAttribute("data-record-key")),
   );
}

function rowsWithClass(screen: RenderResult, className: string) {
   return Array.from(screen.container.querySelectorAll(`tbody.cxe-grid-data.${className}`)).map((t) =>
      Number(t.getAttribute("data-record-key")),
   );
}

async function sortByName(store: Store) {
   await settle(() => {
      store.set(m.sortField, "name");
      store.set(m.sortDirection, "ASC");
   });
}

describe("Grid row state", () => {
   it("moves the alternate row classes with the rows when sorting reorders them", async () => {
      let { store, screen } = await setup();
      assert.deepEqual(rowsWithClass(screen, "cxs-alternate"), [2, 4]);

      await sortByName(store);

      assert.deepEqual(rowIds(screen), [2, 3, 1, 4, 5]);
      assert.deepEqual(rowsWithClass(screen, "cxs-alternate"), [3, 4]);
   });

   it("puts the cursor on the clicked row after sorting moved it", async () => {
      let { store, screen } = await setup({ selection: { type: KeySelection, bind: m.selection } });
      await sortByName(store);

      await settle(() => userEvent.click(screen.getByText("C", { exact: true }).element()));

      assert.equal(store.get(m.selection), 1);
      assert.deepEqual(rowsWithClass(screen, "cxs-cursor"), [1]);
   });

   it("updates the selectable classes when a record changes in a field that is not shown", async () => {
      let { store, screen } = await setup({
         selection: { type: KeySelection, bind: m.selection },
         onCreateIsRecordSelectable: () => (record: Person) => !record.locked,
      });
      assert.deepEqual(rowsWithClass(screen, "cxs-non-selectable"), []);

      await settle(() =>
         store.update(m.records, (records) => records.map((r) => (r.id == 3 ? { ...r, locked: true } : r))),
      );

      assert.deepEqual(rowsWithClass(screen, "cxs-non-selectable"), [3]);
      assert.deepEqual(rowsWithClass(screen, "cxs-selectable"), [1, 2, 4, 5]);
   });

   it("updates the draggable classes when a record changes in a field that is not shown", async () => {
      let { store, screen } = await setup({
         dragSource: { data: { type: "person" } },
         onCreateIsRecordDraggable: () => (record: Person) => !record.locked,
      });
      assert.deepEqual(rowsWithClass(screen, "cxs-non-draggable"), []);

      await settle(() =>
         store.update(m.records, (records) => records.map((r) => (r.id == 3 ? { ...r, locked: true } : r))),
      );

      assert.deepEqual(rowsWithClass(screen, "cxs-non-draggable"), [3]);
      assert.deepEqual(rowsWithClass(screen, "cxs-draggable"), [1, 2, 4, 5]);
   });

   it("marks the row that a dragged row is over, as the drag moves from row to row", async () => {
      let { screen } = await setup({
         dragSource: { data: { type: "person" } },
         dropZone: { mode: "insertion" },
         onRowDropTest: (e: any) => e.source?.data?.type == "person",
         onRowDrop: () => {},
      });
      let middle = (id: number) => {
         let r = rowElement(screen, id).getBoundingClientRect();
         return { x: 20, y: r.top + r.height / 2 };
      };
      let source = middle(5);

      await commands.mouse([
         { move: source },
         { down: true },
         { move: { x: source.x + 6, y: source.y + 6, steps: 3 } },
         { move: { ...middle(3), steps: 5 } },
      ]);
      await expect.poll(() => rowsWithClass(screen, "cxs-over")).toEqual([3]);

      await commands.mouse([{ move: { ...middle(2), steps: 5 } }]);
      await expect.poll(() => rowsWithClass(screen, "cxs-over")).toEqual([2]);

      await commands.mouse([{ up: true }]);
      await settle();
      assert.deepEqual(rowsWithClass(screen, "cxs-over"), []);
   });
});
