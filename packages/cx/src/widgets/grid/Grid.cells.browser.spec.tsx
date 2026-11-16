// What grid cells render besides plain field values: values from expressions and default values, classes and
// styles bound outside the record, formats that follow the culture, and content that reaches the controller.
import { describe, it } from "vitest";
import { userEvent } from "vitest/browser";
import assert from "assert";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { Controller } from "../../ui/Controller";
import { Culture } from "../../ui/Culture";
import type { Instance } from "../../ui/Instance";
import { enableCultureSensitiveFormatting } from "../../ui/Format";
import { Button } from "../Button";
import { Grid, GridConfig } from "./Grid";
import { render, settle, RenderResult } from "../../util/test/render";

interface Person {
   id: number;
   name: string;
   visits: number;
   nick?: string;
}

interface Model {
   records: Person[];
   highlight: string;
   color: string;
   other: number;
   $record: Person;
}

const m = createModel<Model>();

function people(): Person[] {
   return [
      { id: 1, name: "Carol", visits: 1234.5, nick: "C" },
      { id: 2, name: "Alice", visits: 7 },
   ];
}

async function setup(gridProps: Partial<GridConfig>, data: Partial<Model> = {}) {
   let store = new Store({ data: { records: people(), ...data } });
   let screen = await render(
      <cx>
         <Grid records={m.records} keyField="id" {...gridProps} />
      </cx>,
      { store },
   );
   return { store, screen };
}

function cells(screen: RenderResult, column: number) {
   return Array.from(screen.container.querySelectorAll<HTMLElement>(`tbody.cxe-grid-data td:nth-child(${column + 1})`));
}

function cellTexts(screen: RenderResult, column: number) {
   return cells(screen, column).map((td) => td.textContent);
}

describe("Grid cells", () => {
   it("computes cell values from expressions", async () => {
      let { store, screen } = await setup({
         columns: [{ header: "Visits", value: { expr: "{$record.visits} + 1" } }],
      });
      assert.deepEqual(cellTexts(screen, 0), ["1235.5", "8"]);

      await settle(() => store.update(m.records, (records) => records.map((r) => ({ ...r, visits: r.visits * 2 }))));
      assert.deepEqual(cellTexts(screen, 0), ["2470", "15"]);
   });

   it("updates the cell elements of a changed record in place", async () => {
      let { store, screen } = await setup({
         columns: [
            { header: "Name", field: "name" },
            { header: "Visits", field: "visits" },
         ],
      });
      let before = cells(screen, 1);

      await settle(() =>
         store.update(m.records, (records) => records.map((r) => (r.id == 1 ? { ...r, visits: 99 } : r))),
      );

      assert.deepEqual(cellTexts(screen, 1), ["99", "7"]);
      let after = cells(screen, 1);
      assert.ok(after[0] === before[0] && after[1] === before[1]);
   });

   it("shows the default value of a cell binding for records without a value", async () => {
      let { screen } = await setup({
         columns: [{ header: "Nick", value: { bind: "$record.nick", defaultValue: "-" } }],
      });
      assert.deepEqual(cellTexts(screen, 0), ["C", "-"]);
   });

   it("updates cell classes and styles bound to data outside the record", async () => {
      let { store, screen } = await setup(
         { columns: [{ header: "Name", field: "name", class: m.highlight, style: { color: m.color } }] },
         { highlight: "first", color: "red" },
      );
      assert.deepEqual(
         cells(screen, 0).map((td) => [td.classList.contains("first"), td.style.color]),
         [
            [true, "red"],
            [true, "red"],
         ],
      );

      await settle(() => {
         store.set(m.highlight, "second");
         store.set(m.color, "blue");
      });
      assert.deepEqual(
         cells(screen, 0).map((td) => [
            td.classList.contains("first"),
            td.classList.contains("second"),
            td.style.color,
         ]),
         [
            [false, true, "blue"],
            [false, true, "blue"],
         ],
      );
   });

   it("formats cell values with the current culture when the culture changes", async () => {
      // global, but browser test files run in separate frames, so it applies only to this file
      enableCultureSensitiveFormatting();
      let { store, screen } = await setup({
         columns: [{ header: "Visits", field: "visits", format: "n;2" }],
      });
      assert.deepEqual(cellTexts(screen, 0), ["1,234.50", "7.00"]);

      try {
         Culture.setNumberCulture("de-DE");
         // the culture change applies on the next update
         await settle(() => store.set(m.other, 1));
         assert.deepEqual(cellTexts(screen, 0), ["1.234,50", "7,00"]);
      } finally {
         // back to the number format of the default culture
         Culture.setNumberCulture("en");
      }
   });

   it("calls controller methods from buttons in cells, for the record of the clicked row", async () => {
      let opened: number[] = [];

      class PageController extends Controller {
         open(_e: unknown, { store }: Instance) {
            opened.push(store.get(m.$record.id));
         }
      }

      let store = new Store({ data: { records: people() } });
      let screen = await render(
         <cx>
            <div controller={PageController}>
               <Grid
                  records={m.records}
                  keyField="id"
                  columns={[
                     { header: "Name", field: "name" },
                     {
                        header: "",
                        children: (
                           <cx>
                              <Button onClick="open" text="Open" />
                           </cx>
                        ),
                     },
                  ]}
               />
            </div>
         </cx>,
         { store },
      );

      let buttons = screen.container.querySelectorAll("tbody.cxe-grid-data button");
      await settle(() => userEvent.click(buttons[1]));
      await settle(() => userEvent.click(buttons[0]));
      assert.deepEqual(opened, [2, 1]);
   });
});
