import { describe, it } from "vitest";
import assert from "assert";
import { Store } from "../../data/Store";
import { Grid } from "./Grid";
import { bind } from "../../ui/bind";
import { computable } from "../../data/computable";
import { render, settle, RenderResult } from "../../util/test/render";

// priorities 1, 2, 10 sort differently as numbers (1, 2, 10) than their
// "P{priority}" labels do as strings (P1, P10, P2), which makes the sort key
// precedence (sortValue > sortField > value > field) observable in the output
let records = [
   { id: 1, priority: 2 },
   { id: 2, priority: 10 },
   { id: 3, priority: 1 },
];

function getRenderedLabels(screen: RenderResult): string[] {
   return Array.from(screen.container.querySelectorAll("td")).map((td) => td.textContent ?? "");
}

function getHeaders(screen: RenderResult): HTMLElement[] {
   return Array.from(screen.container.querySelectorAll("th"));
}

// Not getByRole("columnheader"): in Vitest 5.1 the in-browser locator engine resolves <th> to the "cell" role
// while Playwright resolves it to "columnheader", so role locators for header cells fail one way or the other.
function header(screen: RenderResult, name: string) {
   return screen.getByText(name, { exact: true });
}

// a real click in the browser, then wait until the grid has rendered the sorted rows
async function clickHeader(screen: RenderResult, name: string) {
   await settle(() => header(screen, name).click());
}

describe("Grid sorting precedence", () => {
   it("sorts by sortField instead of the displayed value when both are set", async () => {
      let widget = (
         <cx>
            <Grid
               records={bind("records")}
               columns={[
                  {
                     header: "Priority",
                     sortField: "priority",
                     value: { tpl: "P{$record.priority}" },
                     sortable: true,
                  },
               ]}
            />
         </cx>
      );

      let store = new Store({ data: { records } });
      const screen = await render(widget, { store });

      await clickHeader(screen, "Priority");
      assert.deepStrictEqual(getRenderedLabels(screen), ["P1", "P2", "P10"]);

      await clickHeader(screen, "Priority");
      assert.deepStrictEqual(getRenderedLabels(screen), ["P10", "P2", "P1"]);
   });

   it("sortValue takes precedence over sortField", async () => {
      let widget = (
         <cx>
            <Grid
               records={bind("records")}
               columns={[
                  {
                     header: "Priority",
                     sortField: "priority",
                     sortValue: computable("$record.priority", (p: number) => -p),
                     value: { tpl: "P{$record.priority}" },
                     sortable: true,
                  },
               ]}
            />
         </cx>
      );

      let store = new Store({ data: { records } });
      const screen = await render(widget, { store });

      await clickHeader(screen, "Priority");
      assert.deepStrictEqual(getRenderedLabels(screen), ["P10", "P2", "P1"]);
   });

   it("sorts by the displayed value when no sortField is set", async () => {
      let widget = (
         <cx>
            <Grid
               records={bind("records")}
               columns={[
                  {
                     header: "Priority",
                     field: "priority",
                     value: { tpl: "P{$record.priority}" },
                     sortable: true,
                  },
               ]}
            />
         </cx>
      );

      let store = new Store({ data: { records } });
      const screen = await render(widget, { store });

      await clickHeader(screen, "Priority");
      assert.deepStrictEqual(getRenderedLabels(screen), ["P1", "P10", "P2"]);
   });

   it("applies sortField precedence to sorters restored from sortField/sortDirection bindings", async () => {
      let widget = (
         <cx>
            <Grid
               records={bind("records")}
               sortField={bind("sortField")}
               sortDirection={bind("sortDirection")}
               columns={[
                  {
                     header: "Priority",
                     sortField: "priority",
                     value: { tpl: "P{$record.priority}" },
                     sortable: true,
                  },
               ]}
            />
         </cx>
      );

      let store = new Store({
         data: { records, sortField: "priority", sortDirection: "ASC" },
      });
      const screen = await render(widget, { store });

      assert.deepStrictEqual(getRenderedLabels(screen), ["P1", "P2", "P10"]);
   });

   it("marks only the clicked column as sorted", async () => {
      let widget = (
         <cx>
            <Grid
               records={bind("records")}
               columns={[
                  {
                     header: "Priority",
                     sortField: "priority",
                     value: { tpl: "P{$record.priority}" },
                     sortable: true,
                  },
                  {
                     header: "Label",
                     value: { tpl: "P{$record.priority}" },
                     sortable: true,
                  },
               ]}
            />
         </cx>
      );

      let store = new Store({ data: { records } });
      const screen = await render(widget, { store });

      await clickHeader(screen, "Priority");

      let headers = getHeaders(screen);
      let sorted = headers.filter((th) => th.className.includes("sorted-asc"));
      assert.strictEqual(sorted.length, 1);
      assert.strictEqual(sorted[0], header(screen, "Priority").element());
   });
});
