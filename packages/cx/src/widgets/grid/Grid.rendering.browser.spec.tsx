import { describe, it } from "vitest";
import assert from "assert";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { tpl } from "../../ui/tpl";
import { Grid, GridConfig } from "./Grid";
import { render, settle, RenderResult } from "../../util/test/render";

interface Person {
   id: number;
   name: string;
   visits: number;
   active: boolean;
}

interface Model {
   records: Person[];
   $record: Person;
}

const m = createModel<Model>();

let records: Person[] = [
   { id: 1, name: "Carol", visits: 1234.5, active: true },
   { id: 2, name: "Alice", visits: 7, active: false },
   { id: 3, name: "Bob", visits: 30, active: true },
];

async function setup(gridProps: Partial<GridConfig>) {
   let store = new Store({ data: { records } });
   let screen = await render(
      <cx>
         <Grid records={m.records} keyField="id" {...gridProps} />
      </cx>,
      { store },
   );
   return { store, screen };
}

function dataRows(screen: RenderResult) {
   return Array.from(screen.container.querySelectorAll("tbody.cxe-grid-data"));
}

function cellTexts(screen: RenderResult) {
   return dataRows(screen).map((tbody) => Array.from(tbody.querySelectorAll("td")).map((td) => td.textContent));
}

describe("Grid rendering", () => {
   it("renders a header and one row per record", async () => {
      let { screen } = await setup({
         columns: [
            { header: "Name", field: "name" },
            { header: "Visits", field: "visits", format: "n;2", align: "right" },
         ],
      });

      let headers = Array.from(screen.container.querySelectorAll("thead th"));
      assert.deepEqual(
         headers.map((th) => th.textContent),
         ["Name", "Visits"],
      );
      assert.ok(headers[1].classList.contains("cxs-aligned-right"));

      // each record is rendered as its own tbody, identified by the record key
      assert.deepEqual(
         dataRows(screen).map((tbody) => tbody.getAttribute("data-record-key")),
         ["1", "2", "3"],
      );
      assert.deepEqual(cellTexts(screen), [
         ["Carol", "1234.50"],
         ["Alice", "7.00"],
         ["Bob", "30.00"],
      ]);
      assert.ok(dataRows(screen)[0].querySelectorAll("td")[1].classList.contains("cxs-aligned-right"));
   });

   it("renders column values from fields, selectors, templates and content", async () => {
      let { screen } = await setup({
         columns: [
            { header: "Field", field: "name" },
            { header: "Value", value: (data: Model) => data.$record.visits * 2, format: "n;1" },
            { header: "Template", value: tpl(m.$record.name, m.$record.visits, "{0} ({1})") },
            {
               header: "Content",
               children: (
                  <cx>
                     <strong text={m.$record.name} />
                  </cx>
               ),
            },
         ],
      });

      assert.deepEqual(cellTexts(screen)[0], ["Carol", "2469.0", "Carol (1234.5)", "Carol"]);
      assert.ok(dataRows(screen)[0].querySelector("td:nth-child(4) > strong"));
   });

   it("updates rows when records change, are added or removed", async () => {
      let { store, screen } = await setup({ columns: [{ header: "Name", field: "name" }] });

      await settle(() =>
         store.update(m.records, (records) => [
            ...records.filter((r) => r.id != 2).map((r) => (r.id == 3 ? { ...r, name: "Robert" } : r)),
            { id: 4, name: "Dave", visits: 0, active: true },
         ]),
      );

      assert.deepEqual(cellTexts(screen), [["Carol"], ["Robert"], ["Dave"]]);
   });

   it("keeps the row elements of records when they move, if keyField is set", async () => {
      let { store, screen } = await setup({ columns: [{ header: "Name", field: "name" }] });
      let aliceRow = dataRows(screen)[1];

      await settle(() => store.update(m.records, (records) => [...records].reverse()));

      assert.deepEqual(cellTexts(screen), [["Bob"], ["Alice"], ["Carol"]]);
      assert.strictEqual(dataRows(screen)[1], aliceRow);
      assert.strictEqual(dataRows(screen)[0].getAttribute("data-record-key"), "3");
   });

   it("shows emptyText when there are no records", async () => {
      let { store, screen } = await setup({ columns: [{ header: "Name", field: "name" }], emptyText: "No people" });

      await settle(() => store.set(m.records, []));

      assert.equal(dataRows(screen).length, 0);
      assert.equal(screen.container.querySelector("tbody")!.textContent, "No people");
   });

   it("applies rowClass and rowStyle to each row", async () => {
      let { screen } = await setup({
         columns: [{ header: "Name", field: "name" }],
         rowClass: { inactive: (data: Model) => !data.$record.active },
         rowStyle: { color: (data: Model) => (data.$record.visits > 10 ? "red" : null) },
      });

      assert.deepEqual(
         dataRows(screen).map((tbody) => [tbody.classList.contains("inactive"), tbody.getAttribute("style")]),
         [
            [false, "color: red;"],
            [true, null],
            [false, "color: red;"],
         ],
      );
   });

   it("renders column footers and aggregates over all records in a footer row", async () => {
      let { store, screen } = await setup({
         columns: [
            { header: "Name", field: "name", footer: "Total" },
            { header: "Visits", field: "visits", aggregate: "sum" },
         ],
      });
      let footer = () =>
         Array.from(screen.container.querySelectorAll("tbody.cxe-grid-group-footer td")).map((td) => td.textContent);

      assert.deepEqual(footer(), ["Total", "1271.5"]);

      await settle(() => store.update(m.records, (records) => records.filter((r) => r.id != 1)));
      assert.deepEqual(footer(), ["Total", "37"]);
   });
});
