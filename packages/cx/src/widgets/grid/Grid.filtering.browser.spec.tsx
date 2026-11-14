import { describe, it } from "vitest";
import { userEvent } from "vitest/browser";
import assert from "assert";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { HoverSync } from "../../ui/HoverSync";
import { Grid } from "./Grid";

// the column header widget, as seen by onColumnContextMenu
type GridColumnHeader = { field?: string };
import { render, settle, RenderResult } from "../../util/test/render";

interface Person {
   id: number;
   name: string;
   city: string;
}

interface Model {
   records: Person[];
   search: string;
   city: string;
   $record: Person;
}

const m = createModel<Model>();

let records: Person[] = [
   { id: 1, name: "Carol", city: "Paris" },
   { id: 2, name: "Alice", city: "Rome" },
   { id: 3, name: "Bob", city: "Paris" },
];

function names(screen: RenderResult, grid = 0) {
   return Array.from(screen.container.querySelectorAll(".cxb-grid")[grid].querySelectorAll("tbody.cxe-grid-data")).map(
      (tbody) => tbody.querySelector("td")!.textContent,
   );
}

describe("Grid filtering", () => {
   async function setup(onTrack?: (count: number) => void) {
      let store = new Store({ data: { records } });
      let screen = await render(
         <cx>
            <Grid
               records={m.records}
               keyField="id"
               emptyText="Nothing found"
               filterParams={{ search: m.search, city: m.city }}
               onCreateFilter={({ search, city }) =>
                  (person: Person) =>
                     (!search || person.name.toLowerCase().includes(search.toLowerCase())) &&
                     (!city || person.city == city)
                  }
               onTrackMappedRecords={(mapped) => onTrack?.(mapped.length)}
               columns={[
                  { header: "Name", field: "name", sortable: true },
                  { header: "City", field: "city" },
               ]}
            />
         </cx>,
         { store },
      );
      return { store, screen };
   }

   it("shows only the records that pass the filter created for the filter params", async () => {
      let { store, screen } = await setup();
      assert.deepEqual(names(screen), ["Carol", "Alice", "Bob"]);

      await settle(() => store.set(m.search, "o"));
      assert.deepEqual(names(screen), ["Carol", "Bob"]);

      await settle(() => store.set(m.city, "Paris"));
      await settle(() => store.set(m.search, "b"));
      assert.deepEqual(names(screen), ["Bob"]);

      await settle(() => store.set({ [m.search.toString()]: null, [m.city.toString()]: null }));
      assert.deepEqual(names(screen), ["Carol", "Alice", "Bob"]);
   });

   it("sorts the filtered records", async () => {
      let { store, screen } = await setup();

      await settle(() => store.set(m.city, "Paris"));
      await settle(() => screen.getByText("Name", { exact: true }).click());

      assert.deepEqual(names(screen), ["Bob", "Carol"]);
   });

   it("shows emptyText if no records pass the filter", async () => {
      let { store, screen } = await setup();

      await settle(() => store.set(m.search, "zzz"));

      assert.deepEqual(names(screen), []);
      assert.ok(screen.container.querySelector("tbody")!.textContent!.includes("Nothing found"));
   });

   it("reports the filtered records to onTrackMappedRecords", async () => {
      let counts: number[] = [];
      let { store } = await setup((count) => counts.push(count));

      await settle(() => store.set(m.search, "o"));
      await settle(() => store.set(m.search, "zzz"));

      assert.deepEqual(counts, [3, 2, 0]);
   });
});

describe("Grid context menus", () => {
   it("calls onRowContextMenu with the row instance and onColumnContextMenu with the column instance", async () => {
      let calls: string[] = [];
      let store = new Store({ data: { records } });
      let screen = await render(
         <cx>
            <Grid
               records={m.records}
               keyField="id"
               onRowContextMenu={(e, instance) => calls.push("row " + instance.store.get(m.$record.name))}
               onColumnContextMenu={(e, instance) =>
                  calls.push("column " + (instance.widget as GridColumnHeader).field)
               }
               columns={[
                  { header: "Name", field: "name" },
                  { header: "City", field: "city" },
               ]}
            />
         </cx>,
         { store },
      );

      await settle(() =>
         userEvent.click(screen.getByText("Alice", { exact: true }).element(), { button: "right" } as any),
      );
      // the column header is a <th>, which userEvent cannot target in Vitest 5.1 (see CLAUDE.md)
      let cityHeader = Array.from(screen.container.querySelectorAll("th")).find((th) => th.textContent == "City")!;
      await settle(() => cityHeader.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, button: 2 })));

      assert.deepEqual(calls, ["row Alice", "column city"]);
   });
});

describe("Grid hover sync", () => {
   it("marks the row with the same hover id in all grids on the channel", async () => {
      let store = new Store({ data: { records } });
      let screen = await render(
         <cx>
            <HoverSync>
               <Grid
                  records={m.records}
                  keyField="id"
                  hoverChannel="people"
                  rowHoverId={m.$record.id}
                  columns={[{ header: "Name", field: "name" }]}
               />
               <Grid
                  records={m.records}
                  keyField="id"
                  hoverChannel="people"
                  rowHoverId={m.$record.id}
                  columns={[{ header: "City", field: "city" }]}
               />
            </HoverSync>
         </cx>,
         { store },
      );
      let hovered = () =>
         Array.from(screen.container.querySelectorAll("tbody.cxe-grid-data.cxs-hover")).map(
            (tbody) => tbody.querySelector("td")!.textContent,
         );

      await settle(() => userEvent.hover(screen.getByText("Bob", { exact: true }).element()));
      assert.deepEqual(hovered(), ["Bob", "Paris"]);

      await settle(() => userEvent.hover(screen.getByText("Rome", { exact: true }).element()));
      assert.deepEqual(hovered(), ["Alice", "Rome"]);
   });
});
