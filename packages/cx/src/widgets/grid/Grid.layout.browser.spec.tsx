// Layout depends on the grid styles: the header, fixed columns and fixed footer are separate tables
// which the grid keeps aligned with the scrolled body by copying cell sizes and scroll positions.
import "../../index.scss";
import { describe, expect, it } from "vitest";
import assert from "assert";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { Grid, GridColumnConfig, GridConfig } from "./Grid";
import { render, settle, RenderResult } from "../../util/test/render";

interface Model {
   records: { id: number; name: string; city: string; visits: number }[];
}

const m = createModel<Model>();

let records = Array.from({ length: 50 }, (_, i) => ({
   id: i + 1,
   name: "Name " + (i + 1),
   city: "City " + (i + 1),
   visits: (i * 37) % 100,
}));

let columns: GridColumnConfig[] = [
   { header: "Name", field: "name", footer: "Total" },
   { header: "City", field: "city" },
   { header: "Visits", field: "visits", align: "right", aggregate: "sum" },
   // wider than the grid, so the body scrolls horizontally
   {
      header: "Notes",
      value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      style: "white-space: nowrap",
   },
];

async function setup(gridProps: Partial<GridConfig> = {}, gridColumns = columns) {
   let store = new Store({ data: { records } });
   let screen = await render(
      <cx>
         <Grid
            records={m.records}
            keyField="id"
            scrollable
            style="height: 300px; width: 500px"
            columns={gridColumns}
            {...gridProps}
         />
      </cx>,
      { store },
   );
   return { store, screen };
}

function el(screen: RenderResult, selector: string) {
   let element = screen.container.querySelector(selector);
   assert.ok(element, `${selector} not found`);
   return element as HTMLElement;
}

function rect(element: Element) {
   return element.getBoundingClientRect();
}

// cells are aligned if their horizontal positions match within a pixel (sizes are copied as rounded values)
function assertHorizontallyAligned(a: Element, b: Element, label: string) {
   let ra = rect(a);
   let rb = rect(b);
   assert.ok(Math.abs(ra.left - rb.left) < 1, `${label}: left ${ra.left} != ${rb.left}`);
   assert.ok(Math.abs(ra.width - rb.width) < 1, `${label}: width ${ra.width} != ${rb.width}`);
}

function assertVerticallyAligned(a: Element, b: Element, label: string) {
   let ra = rect(a);
   let rb = rect(b);
   assert.ok(Math.abs(ra.top - rb.top) < 1, `${label}: top ${ra.top} != ${rb.top}`);
   assert.ok(Math.abs(ra.height - rb.height) < 1, `${label}: height ${ra.height} != ${rb.height}`);
}

function row(screen: RenderResult, area: string, id: number) {
   return el(screen, `${area} tbody[data-record-key="${id}"]`);
}

function headerCells(screen: RenderResult, area: string) {
   return Array.from(el(screen, area).querySelectorAll("th")).filter((th) => th.textContent != "");
}

async function scroll(element: HTMLElement, position: { top?: number; left?: number }) {
   await settle(() => {
      if (position.top != null) element.scrollTop = position.top;
      if (position.left != null) element.scrollLeft = position.left;
   });
   // scroll events are dispatched asynchronously
   await new Promise((resolve) => requestAnimationFrame(resolve));
   await settle();
}

describe("Grid layout", () => {
   it("aligns the fixed header with the body columns", async () => {
      let { screen } = await setup();
      let header = headerCells(screen, ".cxe-grid-fixed-header");
      let cells = Array.from(row(screen, ".cxe-grid-scroll-area", 1).querySelectorAll("td"));

      assert.deepEqual(
         header.map((th) => th.textContent),
         ["Name", "City", "Visits", "Notes"],
      );
      header.forEach((th, i) => assertHorizontallyAligned(th, cells[i], th.textContent!));
   });

   it("keeps the header in place when the body scrolls down and moves it when the body scrolls sideways", async () => {
      let { screen } = await setup();
      let scroller = el(screen, ".cxe-grid-scroll-area");
      let headerTop = rect(headerCells(screen, ".cxe-grid-fixed-header")[0]).top;

      await scroll(scroller, { top: 400, left: 100 });

      assert.ok(scroller.scrollTop > 0, "scrolled down");
      assert.ok(scroller.scrollLeft > 0, "scrolled sideways");
      let header = headerCells(screen, ".cxe-grid-fixed-header");
      assert.equal(rect(header[0]).top, headerTop);
      let firstVisibleRow = Array.from(scroller.querySelectorAll("tbody.cxe-grid-data")).find(
         (tbody) => rect(tbody).bottom > rect(scroller).top,
      )!;
      let cells = Array.from(firstVisibleRow.querySelectorAll("td"));
      header.forEach((th, i) => assertHorizontallyAligned(th, cells[i], th.textContent!));
   });

   it("resizes the header when the column widths change with the data", async () => {
      let { store, screen } = await setup();
      let nameHeader = () => headerCells(screen, ".cxe-grid-fixed-header")[0];
      let widthBefore = rect(nameHeader()).width;

      await settle(() =>
         store.update(m.records, (records: any[]) =>
            records.map((r) => (r.id == 1 ? { ...r, name: "A considerably longer name than before" } : r)),
         ),
      );

      assert.ok(rect(nameHeader()).width > widthBefore);
      assertHorizontallyAligned(nameHeader(), row(screen, ".cxe-grid-scroll-area", 1).querySelector("td")!, "Name");
   });

   it("shows fixed columns in a separate area, aligned with the scrolled rows", async () => {
      let { screen } = await setup({}, [{ ...columns[0], fixed: true }, ...columns.slice(1)]);
      let fixedArea = el(screen, ".cxe-grid-fixed-scroll-area");
      let scroller = el(screen, ".cxe-grid-scroll-area");

      assert.deepEqual(
         headerCells(screen, ".cxe-grid-fixed-fixed-header").map((th) => th.textContent),
         ["Name"],
      );
      assert.deepEqual(
         headerCells(screen, ".cxe-grid-fixed-header").map((th) => th.textContent),
         ["City", "Visits", "Notes"],
      );
      assert.ok(rect(fixedArea).right <= rect(scroller).left + 1);
      assert.equal(row(screen, ".cxe-grid-fixed-scroll-area", 3).textContent, "Name 3");
      assert.equal(row(screen, ".cxe-grid-scroll-area", 3).querySelector("td")!.textContent, "City 3");
      assertVerticallyAligned(
         row(screen, ".cxe-grid-fixed-scroll-area", 3),
         row(screen, ".cxe-grid-scroll-area", 3),
         "row 3",
      );

      await scroll(scroller, { top: 500, left: 100 });

      await expect.poll(() => fixedArea.scrollTop).toBe(scroller.scrollTop);
      assertVerticallyAligned(
         row(screen, ".cxe-grid-fixed-scroll-area", 25),
         row(screen, ".cxe-grid-scroll-area", 25),
         "row 25",
      );
      // fixed columns do not scroll sideways
      assert.ok(rect(row(screen, ".cxe-grid-fixed-scroll-area", 25)).left >= rect(screen.container).left);
   });

   it("scrolls the body when the fixed columns area is scrolled with the wheel", async () => {
      let { screen } = await setup({}, [{ ...columns[0], fixed: true }, ...columns.slice(1)]);
      let fixedArea = el(screen, ".cxe-grid-fixed-scroll-area");
      let scroller = el(screen, ".cxe-grid-scroll-area");

      await settle(() =>
         fixedArea.dispatchEvent(new WheelEvent("wheel", { deltaY: 120, bubbles: true, cancelable: true })),
      );

      await expect.poll(() => scroller.scrollTop).toBeGreaterThan(0);
      await expect.poll(() => fixedArea.scrollTop).toBe(scroller.scrollTop);
   });

   it("shows the fixed footer below the body, aligned with the columns", async () => {
      let { screen } = await setup({ fixedFooter: true });
      let footer = el(screen, ".cxe-grid-fixed-footer");
      let scroller = el(screen, ".cxe-grid-scroll-area");

      let footerCells = Array.from(footer.querySelectorAll("td")).filter((td) => td.textContent != "");
      assert.deepEqual(
         footerCells.map((td) => td.textContent),
         ["Total", String(records.reduce((sum, r) => sum + r.visits, 0))],
      );
      assert.ok(rect(footer).top >= rect(scroller).bottom - 1);
      assert.ok(rect(footer).bottom <= rect(screen.container.firstElementChild!).bottom + 1);

      let cells = Array.from(row(screen, ".cxe-grid-scroll-area", 1).querySelectorAll("td"));
      let allFooterCells = Array.from(footer.querySelectorAll("td"));
      assertHorizontallyAligned(allFooterCells[0], cells[0], "Name footer");
   });
});
