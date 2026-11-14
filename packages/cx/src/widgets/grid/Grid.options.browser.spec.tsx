import "../../index.scss";
import { describe, expect, it } from "vitest";
import assert from "assert";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { KeySelection } from "../../ui/selection/KeySelection";
import { Grid } from "./Grid";
import { render, settle, RenderResult } from "../../util/test/render";

interface Person {
   id: number;
   name: string;
   height?: number;
}

interface Model {
   records: Person[];
   selection: number;
   $record: Person;
}

const m = createModel<Model>();

function people(count: number, name = (id: number) => "Name " + id) {
   return Array.from({ length: count }, (_, i) => ({ id: i + 1, name: name(i + 1) }));
}

// the grid measures and adjusts its layout after rendering and on scroll events
async function waitForGrid() {
   for (let i = 0; i < 3; i++) {
      await new Promise((resolve) => setTimeout(resolve, 30));
      await settle();
   }
}

function scroller(screen: RenderResult) {
   return screen.container.querySelector(".cxe-grid-scroll-area") as HTMLElement;
}

function visibleKeys(screen: RenderResult) {
   let area = scroller(screen).getBoundingClientRect();
   return Array.from(scroller(screen).querySelectorAll("tbody.cxe-grid-data"))
      .filter((tbody) => {
         let r = tbody.getBoundingClientRect();
         return r.bottom > area.top + 1 && r.top < area.bottom - 1;
      })
      .map((tbody) => Number(tbody.getAttribute("data-record-key")));
}

describe("Grid lockColumnWidths", () => {
   async function setup(lockColumnWidths: boolean, count = 3) {
      let store = new Store({ data: { records: people(count) } });
      let screen = await render(
         <cx>
            <Grid
               records={m.records}
               keyField="id"
               lockColumnWidths={lockColumnWidths}
               style="width: 500px"
               columns={[
                  { header: "Name", field: "name" },
                  { header: "Id", field: "id" },
               ]}
            />
         </cx>,
         { store },
      );
      await waitForGrid();
      let widths = () =>
         Array.from(screen.container.querySelectorAll("thead th")).map((th) =>
            Math.round(th.getBoundingClientRect().width),
         );
      let showLongNames = () =>
         settle(() =>
            store.set(
               m.records,
               people(count, (id) => `A considerably longer name for person ${id}`),
            ),
         );
      return { widths, showLongNames };
   }

   it("keeps the column widths of the first render when the data changes", async () => {
      let { widths, showLongNames } = await setup(true);
      let before = widths();

      await showLongNames();
      await waitForGrid();

      assert.deepEqual(widths(), before);
   });

   it("lets columns adapt to the data without it", async () => {
      let { widths, showLongNames } = await setup(false);
      let before = widths();

      await showLongNames();
      await waitForGrid();

      assert.ok(widths()[0] > before[0], `${widths()} vs ${before}`);
   });

   it("does not lock the widths before the grid shows lockColumnWidthsRequiredRowCount records", async () => {
      let { widths, showLongNames } = await setup(true, 2);
      let before = widths();

      await showLongNames();
      await waitForGrid();

      assert.ok(widths()[0] > before[0], `${widths()} vs ${before}`);
   });
});

describe("Grid scrollSelectionIntoView", () => {
   it("scrolls to the selected row when the selection changes", async () => {
      let store = new Store({ data: { records: people(100) } });
      let screen = await render(
         <cx>
            <Grid
               records={m.records}
               keyField="id"
               scrollable
               style="height: 200px"
               scrollSelectionIntoView
               selection={{ type: KeySelection, bind: m.selection }}
               columns={[{ header: "Name", field: "name" }]}
            />
         </cx>,
         { store },
      );

      await settle(() => store.set(m.selection, 80));
      await waitForGrid();
      assert.ok(visibleKeys(screen).includes(80), `visible: ${visibleKeys(screen)}`);

      await settle(() => store.set(m.selection, 5));
      await waitForGrid();
      assert.ok(visibleKeys(screen).includes(5), `visible: ${visibleKeys(screen)}`);
   });
});

describe("Grid measureRowHeights", () => {
   // the first half of the rows is taller, so an average row height does not fit any part of the grid
   async function setupVariableHeights(gridProps: any) {
      let records = people(300).map((p) => ({ ...p, height: p.id <= 150 ? 80 : 20 }));
      let store = new Store({ data: { records } });
      let screen = await render(
         <cx>
            <Grid
               records={m.records}
               keyField="id"
               buffered
               measureRowHeights
               style="height: 300px"
               columns={[
                  {
                     header: "Name",
                     field: "name",
                     children: <div style={{ height: m.$record.height }} text={m.$record.name} />,
                  },
               ]}
               {...gridProps}
            />
         </cx>,
         { store },
      );
      await waitForGrid();
      return screen;
   }

   async function assertPositionsFollowMeasuredHeights(screen: RenderResult) {
      let scrollTo = async (top: number) => {
         await settle(() => {
            scroller(screen).scrollTop = top;
         });
         await waitForGrid();
      };
      let row = (id: number) => scroller(screen).querySelector(`tbody[data-record-key="${id}"]`);

      // rows are measured when they are rendered (60 at a time), so scroll through all of them once,
      // noting the height of a tall and a short row on the way, rounded like the grid measures them (offsetHeight)
      let tall = 0,
         short = 0;
      for (let top = 0; top < scroller(screen).scrollHeight; top += 1000) {
         await scrollTo(top);
         if (row(1)) tall = (row(1) as HTMLElement).offsetHeight;
         if (row(300)) short = (row(300) as HTMLElement).offsetHeight;
      }
      assert.ok(tall > short && short > 0, `tall ${tall}, short ${short}`);
      let top = (id: number) => Math.min(id - 1, 150) * tall + Math.max(0, id - 151) * short;

      for (let id of [100, 160, 220, 120]) {
         await scrollTo(top(id));
         await waitForGrid();

         let first = visibleKeys(screen)[0];
         assert.ok(Math.abs(first - id) <= 1, `scrolled to row ${id}, first visible ${first}`);
      }
   }

   it("positions buffered rows of different heights by their measured heights", { timeout: 20000 }, async () => {
      // sorted, so that the grid maps all records; see the known bug below
      let screen = await setupVariableHeights({ defaultSortField: "id" });
      await assertPositionsFollowMeasuredHeights(screen);
   });

   // Known bug #1351: measured heights are used only if the grid has mapped records (instance.records), which a
   // buffered grid without sorting, filtering or grouping does not have, so it falls back to a uniform row height.
   it.fails("uses measured heights in a buffered grid without sorting (#1351)", { timeout: 20000 }, async () => {
      let screen = await setupVariableHeights({});
      await assertPositionsFollowMeasuredHeights(screen);
   });
});

describe("Grid file drops", () => {
   it("passes dropped files and the insertion position to onDrop with allowsFileDrops", async () => {
      let drops: { files: string[]; insertionIndex: number }[] = [];
      let store = new Store({ data: { records: people(3) } });
      let screen = await render(
         <cx>
            <Grid
               records={m.records}
               keyField="id"
               allowsFileDrops
               dropZone={{ mode: "insertion" }}
               onDropTest={(e: any) => e.dataTransfer?.types?.includes("Files")}
               onDrop={(e: any) =>
                  drops.push({
                     files: Array.from(e.dataTransfer.files as FileList).map((f) => f.name),
                     insertionIndex: e.target.insertionIndex,
                  })
               }
               columns={[{ header: "Name", field: "name" }]}
            />
         </cx>,
         { store },
      );

      // A drag from the operating system cannot be performed in the browser, so the HTML drag events are
      // dispatched with a DataTransfer holding a file, over the top edge of the second row.
      let cell = screen.container.querySelector('tbody[data-record-key="2"] td')!;
      let rect = cell.getBoundingClientRect();
      let dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File(["content"], "report.pdf"));
      let dispatch = (type: string) =>
         settle(() =>
            cell.dispatchEvent(
               new DragEvent(type, {
                  bubbles: true,
                  cancelable: true,
                  dataTransfer,
                  clientX: rect.left + 5,
                  clientY: rect.top + 2,
               }),
            ),
         );

      await dispatch("dragenter");
      await dispatch("dragover");
      assert.ok(screen.container.querySelector(".cxe-grid-dropzone"), "insertion marker shown");

      await dispatch("drop");
      assert.deepEqual(drops, [{ files: ["report.pdf"], insertionIndex: 1 }]);
      assert.equal(screen.container.querySelector(".cxe-grid-dropzone"), null);
   });

   it("ignores file drags without allowsFileDrops", async () => {
      let drops: any[] = [];
      let store = new Store({ data: { records: people(3) } });
      let screen = await render(
         <cx>
            <Grid
               records={m.records}
               keyField="id"
               onDropTest={() => true}
               onDrop={(e) => drops.push(e)}
               columns={[{ header: "Name", field: "name" }]}
            />
         </cx>,
         { store },
      );
      let cell = screen.container.querySelector("tbody.cxe-grid-data td")!;
      let dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File(["content"], "report.pdf"));
      for (let type of ["dragenter", "dragover", "drop"])
         await settle(() => cell.dispatchEvent(new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer })));

      assert.deepEqual(drops, []);
   });
});
