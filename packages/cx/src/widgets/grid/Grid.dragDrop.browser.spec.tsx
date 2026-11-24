// Drag and drop in CxJS is driven by mouse events: a drag starts when the mouse moves over a row with the
// button pressed, so drags are performed with real mouse moves (see util/test/mouse.ts). Drags are not wrapped
// in settle, because React defers state updates inside act, and the grid tracks the drop position in its state.
import "../../index.scss";
import { describe, expect, it } from "vitest";
import { commands, userEvent } from "vitest/browser";
import assert from "assert";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { KeySelection } from "../../ui/selection/KeySelection";
import { DragHandle } from "../drag-drop/DragHandle";
import { Grid, GridConfig } from "./Grid";
import { render, settle, RenderResult } from "../../util/test/render";
import { drag } from "../../util/test/mouse";

interface Person {
   id: number;
   name: string;
}

interface Model {
   records: Person[];
   other: Person[];
   selection: number[];
   $record: Person;
}

const m = createModel<Model>();

interface Drop {
   insertionIndex: number;
   before?: number;
   after?: number;
   source: number;
   sources: number[];
}

function people(...ids: number[]) {
   return ids.map((id) => ({ id, name: "Name " + id }));
}

async function setup(gridProps: Partial<GridConfig> = {}, extra?: any) {
   let drops: Drop[] = [];
   let store = new Store({ data: { records: people(1, 2, 3, 4), other: people(8, 9) } });
   let screen = await render(
      <cx>
         <div>
            <Grid
               records={m.records}
               keyField="id"
               dragSource={{ data: { type: "person" } }}
               dropZone={{ mode: "insertion" }}
               onDropTest={(e) => e.source?.data?.type == "person"}
               onDrop={(e) =>
                  drops.push({
                     insertionIndex: e.target.insertionIndex,
                     before: e.target.recordBefore?.data.id,
                     after: e.target.recordAfter?.data.id,
                     source: e.source.record.data.id,
                     sources: e.source.records.map((r: any) => r.data.id),
                  })
               }
               columns={[{ header: "Name", field: "name" }]}
               {...gridProps}
            />
            {extra}
         </div>
      </cx>,
      { store },
   );
   return { store, screen, drops };
}

function rowElement(screen: RenderResult, id: number) {
   let tbody = screen.container.querySelector(`tbody[data-record-key="${id}"]`);
   assert.ok(tbody, `row ${id} not found`);
   return tbody;
}

function rowIds(screen: RenderResult, gridIndex = 0) {
   let grid = screen.container.querySelectorAll(".cxb-grid")[gridIndex];
   return Array.from(grid.querySelectorAll("tbody.cxe-grid-data")).map((t) =>
      Number(t.getAttribute("data-record-key")),
   );
}

// a point near the top or the bottom edge of a row, which inserts before or after it
function edge(screen: RenderResult, id: number, side: "top" | "bottom") {
   let height = rowElement(screen, id).getBoundingClientRect().height;
   return { x: 20, y: side == "top" ? 2 : height - 2 };
}

async function dragRow(screen: RenderResult, from: number, to: number, side: "top" | "bottom" | "middle") {
   let target = rowElement(screen, to);
   let height = target.getBoundingClientRect().height;
   await drag(rowElement(screen, from), target, {
      sourcePosition: { x: 20, y: height / 2 },
      targetPosition: side == "middle" ? { x: 20, y: height / 2 } : edge(screen, to, side),
   });
   await settle();
}

describe("Grid row drag and drop", () => {
   it("reports the insertion position and the dragged record on drop", async () => {
      let { screen, drops } = await setup();

      await dragRow(screen, 4, 2, "top");
      await dragRow(screen, 3, 1, "bottom");

      assert.deepEqual(drops, [
         { insertionIndex: 1, before: 1, after: 2, source: 4, sources: [4] },
         { insertionIndex: 1, before: 1, after: 2, source: 3, sources: [3] },
      ]);
   });

   it("moves records when onDrop updates the store", async () => {
      let { store, screen } = await setup({
         onDrop: (e) => {
            let moved = e.source.record.data;
            let records = store.get(m.records).filter((r: Person) => r != moved);
            let index = e.target.recordBefore ? records.indexOf(e.target.recordBefore.data) + 1 : 0;
            records.splice(index, 0, moved);
            store.set(m.records, records);
         },
      });

      await dragRow(screen, 3, 1, "top");
      assert.deepEqual(rowIds(screen), [3, 1, 2, 4]);

      await dragRow(screen, 4, 1, "bottom");
      assert.deepEqual(rowIds(screen), [3, 1, 4, 2]);
   });

   it("hides the dragged row, shows a drag clone and marks the insertion position while dragging", async () => {
      let { screen, drops } = await setup();
      let source = rowElement(screen, 3).getBoundingClientRect();
      let target = rowElement(screen, 2).getBoundingClientRect();

      await commands.mouse([
         { move: { x: 20, y: source.top + source.height / 2 } },
         { down: true },
         { move: { x: 26, y: source.top + source.height / 2 + 6, steps: 3 } },
         { move: { x: 20, y: target.top + 2, steps: 5 } },
      ]);

      await expect.poll(() => screen.container.querySelector(".cxe-grid-dropzone")).toBeTruthy();
      assert.ok(rowElement(screen, 3).classList.contains("cxs-dragged"));
      assert.equal(rowElement(screen, 3).getBoundingClientRect().height, 0);
      assert.equal(document.querySelector(".cxb-dragclone")?.textContent, "Name 3");
      // the marker is placed before row 2
      let marker = screen.container.querySelector(".cxe-grid-dropzone")!.closest("tbody")!;
      assert.equal(marker.nextElementSibling, rowElement(screen, 2));

      await commands.mouse([{ up: true }]);
      await settle();

      assert.equal(drops.length, 1);
      assert.equal(screen.container.querySelector(".cxe-grid-dropzone"), null);
      assert.equal(document.querySelector(".cxb-dragclone"), null);
      assert.ok(!rowElement(screen, 3).classList.contains("cxs-dragged"));
   });

   it("cancels the drag with escape", async () => {
      let { screen, drops } = await setup();
      let source = rowElement(screen, 3).getBoundingClientRect();
      let target = rowElement(screen, 1).getBoundingClientRect();

      await commands.mouse([
         { move: { x: 20, y: source.top + source.height / 2 } },
         { down: true },
         { move: { x: 20, y: target.top + 2, steps: 8 } },
      ]);
      await expect.poll(() => screen.container.querySelector(".cxe-grid-dropzone")).toBeTruthy();

      await userEvent.keyboard("{Escape}");
      await commands.mouse([{ up: true }]);
      await settle();

      assert.deepEqual(drops, []);
      assert.equal(screen.container.querySelector(".cxe-grid-dropzone"), null);
   });

   it("drags all selected rows together (#1347)", async () => {
      let { screen, drops } = await setup({ selection: { type: KeySelection, bind: m.selection, multiple: true } });

      await settle(() => userEvent.click(screen.getByText("Name 2", { exact: true }).element()));
      await settle(() =>
         userEvent.click(screen.getByText("Name 3", { exact: true }).element(), { modifiers: ["Control"] } as any),
      );
      await dragRow(screen, 3, 1, "top");

      assert.deepEqual(
         drops.map((d) => [d.insertionIndex, d.source, d.sources]),
         [[0, 3, [2, 3]]],
      );
   });

   it("drags only the dragged row if it is not selected", async () => {
      let { screen, store, drops } = await setup({
         selection: { type: KeySelection, bind: m.selection, multiple: true },
      });

      await settle(() => userEvent.click(screen.getByText("Name 2", { exact: true }).element()));
      await settle(() =>
         userEvent.click(screen.getByText("Name 3", { exact: true }).element(), { modifiers: ["Control"] } as any),
      );
      // a ctrl-press on a selected row deselects it, so the drag starts on a row that is not selected
      await userEvent.keyboard("{Control>}");
      try {
         await dragRow(screen, 3, 1, "top");
      } finally {
         await userEvent.keyboard("{/Control}");
      }

      assert.deepEqual(store.get(m.selection), [2]);
      assert.deepEqual(
         drops.map((d) => [d.insertionIndex, d.source, d.sources]),
         [[0, 3, [3]]],
      );
   });

   it("accepts rows from another grid if onDropTest allows it", async () => {
      let { screen, drops } = await setup(
         {},
         <Grid
            records={m.other}
            keyField="id"
            dragSource={{ data: { type: "person" } }}
            columns={[{ header: "Other", field: "name" }]}
         />,
      );

      await dragRow(screen, 9, 2, "top");

      assert.deepEqual(drops, [{ insertionIndex: 1, before: 1, after: 2, source: 9, sources: [9] }]);
   });

   it("rejects drops for which onDropTest returns false", async () => {
      let { screen, drops } = await setup(
         {},
         <Grid
            records={m.other}
            keyField="id"
            dragSource={{ data: { type: "other" } }}
            columns={[{ header: "Other", field: "name" }]}
         />,
      );

      await dragRow(screen, 9, 2, "top");

      assert.deepEqual(drops, []);
   });

   it("is not a drop target without onDropTest", async () => {
      let { screen, drops } = await setup({ onDropTest: undefined });

      await dragRow(screen, 4, 2, "top");

      assert.deepEqual(drops, []);
   });

   it("reports drops onto rows with onRowDrop", async () => {
      let rowDrops: [number, number, number][] = [];
      let { screen, drops } = await setup({
         onDropTest: undefined,
         onRowDropTest: (e) => e.source?.data?.type == "person",
         onRowDrop: (e) => {
            rowDrops.push([e.source.record.data.id, e.target.index, e.target.record.data.id]);
         },
      });

      await dragRow(screen, 4, 2, "middle");
      await dragRow(screen, 4, 1, "top");

      assert.deepEqual(rowDrops, [
         [4, 1, 2],
         [4, 0, 1],
      ]);
      assert.deepEqual(drops, []);
   });

   it("starts the drag only from the drag handle, if the row has one", async () => {
      let { screen, drops } = await setup({
         columns: [
            { header: "", items: <DragHandle class="handle">::</DragHandle> },
            { header: "Name", field: "name" },
         ],
      });
      let handle = (id: number) => rowElement(screen, id).querySelector(".handle")!;

      await drag(screen.getByText("Name 4", { exact: true }).element(), rowElement(screen, 2), {
         targetPosition: edge(screen, 2, "top"),
      });
      await settle();
      assert.deepEqual(drops, []);

      await drag(handle(4), rowElement(screen, 2), { targetPosition: edge(screen, 2, "top") });
      await settle();
      assert.deepEqual(
         drops.map((d) => [d.insertionIndex, d.source]),
         [[1, 4]],
      );
   });
});
