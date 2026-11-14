import "../../index.scss";
import { describe, it } from "vitest";
import { commands } from "vitest/browser";
import assert from "assert";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { Grid, GridColumnConfig } from "./Grid";
import { render, settle, RenderResult } from "../../util/test/render";
import { drag } from "../../util/test/mouse";

interface Sale {
   id: number;
   country: string;
   city: string;
   q1: number;
   q2: number;
}

interface Model {
   records: Sale[];
   showQ2: boolean;
   fields: string;
   widths: Record<string, number>;
   order: string[];
}

const m = createModel<Model>();

let records: Sale[] = [
   { id: 1, country: "France", city: "Paris", q1: 1, q2: 2 },
   { id: 2, country: "France", city: "Lyon", q1: 3, q2: 4 },
   { id: 3, country: "Spain", city: "Madrid", q1: 5, q2: 6 },
];

// header rows as "text" with "/cN" and "/rN" for col and row spans
function describeHeader(screen: RenderResult) {
   return Array.from(screen.container.querySelectorAll("thead tr")).map((tr) =>
      Array.from(tr.querySelectorAll("th"))
         .map(
            (th) =>
               th.textContent + (th.colSpan > 1 ? `/c${th.colSpan}` : "") + (th.rowSpan > 1 ? `/r${th.rowSpan}` : ""),
         )
         .join(" | "),
   );
}

// data rows are tbody elements, except in grids with merged cells, where they are tr elements
function describeBody(screen: RenderResult) {
   return Array.from(screen.container.querySelectorAll(".cxe-grid-data")).map((row) => {
      let tr = row.tagName == "TR" ? row : row.querySelector("tr")!;
      return Array.from(tr.querySelectorAll("td"))
         .map((td) => td.textContent + (td.rowSpan > 1 ? `/r${td.rowSpan}` : ""))
         .join(" | ");
   });
}

async function setup(columns: GridColumnConfig[], gridProps: any = {}, data: Partial<Model> = {}) {
   let store = new Store({ data: { records, showQ2: true, widths: {}, ...data } });
   let screen = await render(
      <cx>
         <Grid records={m.records} keyField="id" columns={columns} {...gridProps} />
      </cx>,
      { store },
   );
   return { store, screen };
}

describe("Grid columns", () => {
   it("renders multi-line headers with column and row spans", async () => {
      let { screen } = await setup([
         { header1: { text: "Id", rowSpan: 2 }, field: "id" },
         { header1: { text: "Location", colSpan: 2 }, header2: "Country", field: "country" },
         { header2: "City", field: "city" },
         { header1: { text: "Sales", colSpan: 2 }, header2: "Q1", field: "q1" },
         { header2: "Q2", field: "q2" },
      ]);

      assert.deepEqual(describeHeader(screen), ["Id/r2 | Location/c2 | Sales/c2", "Country | City | Q1 | Q2"]);
      assert.deepEqual(describeBody(screen)[0], "1 | France | Paris | 1 | 2");
   });

   it("shows and hides columns bound to visible", async () => {
      let { store, screen } = await setup([
         { header: "City", field: "city" },
         { header: "Q1", field: "q1" },
         { header: "Q2", field: "q2", visible: m.showQ2 },
      ]);

      assert.deepEqual(describeHeader(screen), ["City | Q1 | Q2"]);

      await settle(() => store.set(m.showQ2, false));
      assert.deepEqual(describeHeader(screen), ["City | Q1"]);
      assert.deepEqual(describeBody(screen), ["Paris | 1", "Lyon | 3", "Madrid | 5"]);

      await settle(() => store.set(m.showQ2, true));
      assert.deepEqual(describeBody(screen)[0], "Paris | 1 | 2");
   });

   it("recalculates columns with onGetColumns when columnParams change", async () => {
      let { store, screen } = await setup([], {
         columns: undefined,
         columnParams: { fields: m.fields },
         onGetColumns: ({ fields }: { fields?: string }) =>
            (fields ?? "city").split(",").map((field) => ({ header: field.toUpperCase(), field })),
      });

      assert.deepEqual(describeHeader(screen), ["CITY"]);
      assert.deepEqual(describeBody(screen), ["Paris", "Lyon", "Madrid"]);

      await settle(() => store.set(m.fields, "country,q2"));
      assert.deepEqual(describeHeader(screen), ["COUNTRY | Q2"]);
      assert.deepEqual(describeBody(screen), ["France | 2", "France | 4", "Spain | 6"]);
   });

   it("merges consecutive cells with the same value", async () => {
      let { store, screen } = await setup([
         { header: "Country", field: "country", mergeCells: "same-value" },
         { header: "City", field: "city" },
      ]);

      assert.deepEqual(describeBody(screen), ["France/r2 | Paris", "Lyon", "Spain | Madrid"]);

      await settle(() =>
         store.update(m.records, (records) => records.map((r) => (r.id == 2 ? { ...r, country: "Italy" } : r))),
      );
      assert.deepEqual(describeBody(screen), ["France | Paris", "Italy | Lyon", "Spain | Madrid"]);
   });
});

describe("Grid column resizing", () => {
   async function setupResizable(onColumnResize?: (data: any) => void) {
      return setup(
         [
            {
               header: { text: "Country", width: m.widths.country, resizable: true, defaultWidth: 100 },
               field: "country",
            },
            { header: "City", width: m.widths.city, resizable: true, field: "city" },
            { header: "Q1", field: "q1" },
         ],
         { scrollable: true, border: true, style: "height: 200px; width: 700px", onColumnResize },
         { widths: { city: 150 } },
      );
   }

   function headerCell(screen: RenderResult, text: string) {
      let th = Array.from(screen.container.querySelectorAll(".cxe-grid-fixed-header th")).find(
         (th) => th.textContent == text,
      );
      assert.ok(th, `header ${text} not found`);
      return th;
   }

   function width(element: Element) {
      return Math.round(element.getBoundingClientRect().width);
   }

   // the resizer at the right edge of the header cell; cells also contain one for the previous column
   function resizer(screen: RenderResult, text: string) {
      let r = headerCell(screen, text).querySelector(".cxe-grid-col-resizer")!.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
   }

   async function dragResizer(screen: RenderResult, text: string, dx: number) {
      let { x, y } = resizer(screen, text);
      await commands.mouse([{ move: { x, y } }, { down: true }, { move: { x: x + dx, y, steps: 5 } }, { up: true }]);
      await settle();
   }

   it("uses the width from the store or the default width", async () => {
      let { screen } = await setupResizable();

      assert.equal(width(headerCell(screen, "Country")), 100);
      assert.equal(width(headerCell(screen, "City")), 150);
   });

   it("resizes a column by dragging its border and stores the width", async () => {
      let resized: number[] = [];
      let { store, screen } = await setupResizable((data) => resized.push(data.width));

      await dragResizer(screen, "City", 40);

      assert.equal(width(headerCell(screen, "City")), 190);
      let cityCell = screen.container.querySelector(".cxe-grid-scroll-area tbody.cxe-grid-data td:nth-child(2)")!;
      assert.equal(width(cityCell), 190);
      assert.deepEqual(store.get(m.widths), { city: 190 });
      assert.deepEqual(resized, [190]);
   });

   it("does not make columns narrower than 30 pixels", async () => {
      let { store, screen } = await setupResizable();

      await dragResizer(screen, "Country", -400);

      assert.equal(width(headerCell(screen, "Country")), 30);
      assert.equal(store.get(m.widths).country, 30);
   });

   it("fits the column to its content on double click", async () => {
      let { store, screen } = await setupResizable();
      // the widest text in the column, including the header
      let cells = [
         headerCell(screen, "City"),
         ...screen.container.querySelectorAll(".cxe-grid-scroll-area tbody.cxe-grid-data td:nth-child(2)"),
      ];
      let textWidths = cells.flatMap((cell) => {
         let widths: number[] = [];
         let walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
         while (walker.nextNode()) {
            let range = document.createRange();
            range.selectNodeContents(walker.currentNode);
            widths.push(range.getBoundingClientRect().width);
         }
         return widths;
      });
      let widest = Math.max(...textWidths);

      await commands.mouse([{ dblclick: resizer(screen, "City") }]);
      await settle();

      let fitted = width(headerCell(screen, "City"));
      assert.ok(fitted < 150, `fitted ${fitted}`);
      assert.ok(fitted >= widest, `fitted ${fitted}, content ${widest}`);
      assert.equal(store.get(m.widths).city, fitted);
   });
});

describe("Grid column reordering", () => {
   it("reports the dragged column and the drop index", async () => {
      let drops: [string, number][] = [];
      let columns: Record<string, GridColumnConfig> = {
         country: { key: "country", header: "Country", field: "country", draggable: true },
         city: { key: "city", header: "City", field: "city", draggable: true },
         q1: { key: "q1", header: "Q1", field: "q1", draggable: true },
      };
      let { store, screen } = await setup(
         [],
         {
            columns: undefined,
            columnParams: m.order,
            onGetColumns: (order: string[]) => order.map((key) => columns[key]),
            onColumnDropTest: (e: any, instance: any) =>
               e.source?.type === "grid-column" && e.source?.gridInstance === instance,
            onColumnDrop: (e: any, { store }: any) => {
               let key = e.source.column.key;
               drops.push([key, e.target.index]);
               let order = store.get(m.order).filter((k: string) => k != key);
               order.splice(e.target.index, 0, key);
               store.set(m.order, order);
            },
         },
         { order: ["country", "city", "q1"] },
      );
      let header = (text: string) =>
         Array.from(screen.container.querySelectorAll("th")).find((th) => th.textContent == text)!;

      await drag(header("Q1"), header("Country"), { targetPosition: { x: 3, y: 5 } });
      await settle();

      assert.deepEqual(drops, [["q1", 0]]);
      assert.deepEqual(store.get(m.order), ["q1", "country", "city"]);
      assert.deepEqual(describeHeader(screen), ["Q1 | Country | City"]);
   });
});
