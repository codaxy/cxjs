import { describe, it } from "vitest";
import assert from "assert";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { Sorter } from "../../ui/Prop";
import { Grid, GridConfig } from "./Grid";
import { render, settle, RenderResult } from "../../util/test/render";

interface Person {
   id: number;
   name: string;
   visits: number;
}

interface Model {
   records: Person[];
   sortField: string;
   sortDirection: string;
   sorters: Sorter[];
}

const m = createModel<Model>();

let records: Person[] = [
   { id: 1, name: "Carol", visits: 20 },
   { id: 2, name: "Alice", visits: 30 },
   { id: 3, name: "Bob", visits: 10 },
];

async function setup(gridProps: Partial<GridConfig> = {}, data: Partial<Model> = {}) {
   let store = new Store({ data: { records, ...data } });
   let screen = await render(
      <cx>
         <Grid
            records={m.records}
            keyField="id"
            columns={[
               { header: "Name", field: "name", sortable: true },
               { header: "Visits", field: "visits", sortable: true },
            ]}
            {...gridProps}
         />
      </cx>,
      { store },
   );
   return { store, screen };
}

function names(screen: RenderResult) {
   return Array.from(screen.container.querySelectorAll("tbody.cxe-grid-data")).map((tbody) =>
      tbody.textContent!.replace(/\d+/, ""),
   );
}

function sortedHeaders(screen: RenderResult) {
   return Array.from(screen.container.querySelectorAll("thead th"))
      .filter((th) => th.classList.contains("cxs-sorted-asc") || th.classList.contains("cxs-sorted-desc"))
      .map((th) => th.textContent + (th.classList.contains("cxs-sorted-asc") ? " ASC" : " DESC"));
}

async function clickHeader(screen: RenderResult, text: string) {
   await settle(() => screen.getByText(text, { exact: true }).click());
}

describe("Grid sort state", () => {
   it("toggles between ascending and descending order and marks the sorted column", async () => {
      let { screen } = await setup();
      assert.deepEqual(names(screen), ["Carol", "Alice", "Bob"]);
      assert.deepEqual(sortedHeaders(screen), []);

      await clickHeader(screen, "Name");
      assert.deepEqual(names(screen), ["Alice", "Bob", "Carol"]);
      assert.deepEqual(sortedHeaders(screen), ["Name ASC"]);

      await clickHeader(screen, "Name");
      assert.deepEqual(names(screen), ["Carol", "Bob", "Alice"]);
      assert.deepEqual(sortedHeaders(screen), ["Name DESC"]);

      await clickHeader(screen, "Name");
      assert.deepEqual(sortedHeaders(screen), ["Name ASC"]);
   });

   it("keeps sortField and sortDirection in sync with the store, in both directions", async () => {
      let { store, screen } = await setup({ sortField: m.sortField, sortDirection: m.sortDirection });

      await clickHeader(screen, "Visits");
      assert.deepEqual([store.get(m.sortField), store.get(m.sortDirection)], ["visits", "ASC"]);
      assert.deepEqual(names(screen), ["Bob", "Carol", "Alice"]);

      await settle(() => store.set({ [m.sortField.toString()]: "name", [m.sortDirection.toString()]: "DESC" }));
      assert.deepEqual(names(screen), ["Carol", "Bob", "Alice"]);
      assert.deepEqual(sortedHeaders(screen), ["Name DESC"]);
   });

   it("keeps sorters in sync with the store", async () => {
      let { store, screen } = await setup(
         { sorters: m.sorters },
         { sorters: [{ field: "visits", direction: "DESC" }] },
      );
      assert.deepEqual(names(screen), ["Alice", "Carol", "Bob"]);

      await clickHeader(screen, "Name");
      // compared as JSON: sorters also carry keys with undefined values
      assert.deepEqual(JSON.parse(JSON.stringify(store.get(m.sorters))), [{ field: "name", direction: "ASC" }]);
      assert.deepEqual(names(screen), ["Alice", "Bob", "Carol"]);
   });

   it("sorts by defaultSortField until a column is clicked", async () => {
      let { store, screen } = await setup({
         sorters: m.sorters,
         defaultSortField: "visits",
         defaultSortDirection: "DESC",
      });

      assert.deepEqual(names(screen), ["Alice", "Carol", "Bob"]);
      assert.deepEqual(sortedHeaders(screen), ["Visits DESC"]);
      // the default is not written to the store
      assert.equal(store.get(m.sorters), undefined);
   });

   it("starts with primarySortDirection on the first click", async () => {
      let { screen } = await setup({
         columns: [
            { header: "Name", field: "name", sortable: true },
            { header: "Visits", field: "visits", sortable: true, primarySortDirection: "DESC" },
         ],
      });

      await clickHeader(screen, "Visits");
      assert.deepEqual(sortedHeaders(screen), ["Visits DESC"]);
      assert.deepEqual(names(screen), ["Alice", "Carol", "Bob"]);
   });

   // With remoteSort, the sort indicator comes from the bindings: header clicks do not update the grid's own sort state.
   it("only stores the sort order with remoteSort", async () => {
      let { store, screen } = await setup({ remoteSort: true, sortField: m.sortField, sortDirection: m.sortDirection });

      await clickHeader(screen, "Name");

      assert.deepEqual([store.get(m.sortField), store.get(m.sortDirection)], ["name", "ASC"]);
      assert.deepEqual(sortedHeaders(screen), ["Name ASC"]);
      assert.deepEqual(names(screen), ["Carol", "Alice", "Bob"]);
   });

   it("clears sorting on the third click with clearableSort", async () => {
      let { store, screen } = await setup({
         clearableSort: true,
         sortField: m.sortField,
         sortDirection: m.sortDirection,
      });

      await clickHeader(screen, "Name");
      await clickHeader(screen, "Name");
      await clickHeader(screen, "Name");

      assert.deepEqual(sortedHeaders(screen), []);
      assert.equal(store.get(m.sortField), null);
      assert.equal(store.get(m.sortDirection), null);
   });

   it("restores the original order when sorting is cleared (#1350)", async () => {
      let { screen } = await setup({ clearableSort: true });

      await clickHeader(screen, "Name");
      await clickHeader(screen, "Name");
      await clickHeader(screen, "Name");

      assert.deepEqual(names(screen), ["Carol", "Alice", "Bob"]);
   });
});
