import { describe, it } from "vitest";
import assert from "assert";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { tpl } from "../../ui/tpl";
import { Grid, GridColumnConfig, GridConfig } from "./Grid";
import { render, settle, RenderResult } from "../../util/test/render";

// One line per row: "caption <level>: <text>", "data: <cells>" or "footer <level>: <cells>".
// Inner grouping levels have lower numbers, i.e. the last grouping in the list is level 1.
function describeRows(screen: RenderResult): string[] {
   return Array.from(screen.container.querySelectorAll("tbody")).map((tbody) => {
      let level = tbody.className.match(/cxs-level-(\d+)/)?.[1];
      let kind = tbody.classList.contains("cxe-grid-data")
         ? "data"
         : tbody.classList.contains("cxe-grid-group-caption")
           ? `caption ${level}`
           : tbody.classList.contains("cxe-grid-group-footer")
             ? `footer ${level}`
             : tbody.classList.contains("cxe-grid-header")
               ? "header"
               : tbody.className;
      let cells = Array.from(tbody.querySelectorAll("td, th")).map((cell) => cell.textContent);
      return `${kind}: ${cells.join(" | ")}`;
   });
}

interface Person {
   id: number;
   name: string;
   continent: string;
   browser: string;
   visits: number;
}

interface GroupData {
   continent: string;
   value: string;
   name: number;
   browsers: number;
   average: number;
}

interface Model {
   records: Person[];
   groupBy: string;
   $record: Person;
   $group: GroupData;
}

const m = createModel<Model>();

let records = [
   { id: 1, name: "Alice", continent: "Europe", browser: "Chrome", visits: 45 },
   { id: 2, name: "Bob", continent: "Asia", browser: "Firefox", visits: 32 },
   { id: 3, name: "Carol", continent: "Europe", browser: "Safari", visits: 28 },
   { id: 4, name: "Dave", continent: "Europe", browser: "Chrome", visits: 51 },
   { id: 5, name: "Eve", continent: "Africa", browser: "Edge", visits: 12 },
];

let byContinent = {
   key: { continent: m.$record.continent },
   showCaption: true,
   showFooter: true,
   caption: m.$group.continent,
};

async function setup(gridProps: Partial<GridConfig>, columns: GridColumnConfig[]) {
   let store = new Store({ data: { records } });
   let screen = await render(
      <cx>
         <Grid records={m.records} keyField="id" columns={columns} {...gridProps} />
      </cx>,
      { store },
   );
   return { store, screen };
}

async function clickHeader(screen: RenderResult, text: string) {
   await settle(() => screen.getByText(text, { exact: true }).click());
}

describe("Grid grouping", () => {
   it("shows a caption for each group and the records below it, with groups ordered by key", async () => {
      // no column has an aggregate or a footer, so no group footers are rendered despite showFooter
      let { screen } = await setup({ grouping: [byContinent] }, [{ header: "Name", field: "name" }]);

      assert.deepEqual(describeRows(screen), [
         "caption 1: Africa",
         "data: Eve",
         "caption 1: Asia",
         "data: Bob",
         "caption 1: Europe",
         "data: Alice",
         "data: Carol",
         "data: Dave",
      ]);
   });

   it("calculates aggregates and shows them in group footers", async () => {
      let { screen } = await setup({ grouping: [byContinent] }, [
         { header: "Name", field: "name", aggregate: "count", footer: tpl(m.$group.name, "{0} people") },
         {
            header: "Browser",
            field: "browser",
            aggregate: "distinct",
            aggregateAlias: "browsers",
            footer: tpl(m.$group.browsers, "{0} browsers"),
         },
         { header: "Visits", field: "visits", aggregate: "sum" },
         {
            header: "Average",
            field: "visits",
            aggregate: "avg",
            aggregateAlias: "average",
            footer: { value: m.$group.average, format: "n;1" },
         },
         { header: "Min", field: "visits", aggregate: "min", aggregateAlias: "min" },
         { header: "Max", field: "visits", aggregate: "max", aggregateAlias: "max" },
      ]);

      assert.deepEqual(
         describeRows(screen).filter((row) => row.startsWith("footer")),
         [
            "footer 1: 1 people | 1 browsers | 12 | 12.0 | 12 | 12",
            "footer 1: 1 people | 1 browsers | 32 | 32.0 | 32 | 32",
            "footer 1: 3 people | 2 browsers | 124 | 41.3 | 28 | 51",
         ],
      );
   });

   it("supports nested levels, e.g. a total level around the groups", async () => {
      let { screen } = await setup({ grouping: [{ key: {}, showFooter: true }, byContinent] }, [
         { header: "Name", field: "name", aggregate: "count" },
         { header: "Visits", field: "visits", aggregate: "sum" },
      ]);

      assert.deepEqual(describeRows(screen), [
         "caption 1: Africa",
         "data: Eve | 12",
         "footer 1: 1 | 12",
         "caption 1: Asia",
         "data: Bob | 32",
         "footer 1: 1 | 32",
         "caption 1: Europe",
         "data: Alice | 45",
         "data: Carol | 28",
         "data: Dave | 51",
         "footer 1: 3 | 124",
         "footer 2: 5 | 168",
      ]);
   });

   it("repeats the column header in each group when grouping by a field name in a non-scrollable grid", async () => {
      let { screen } = await setup({ grouping: ["continent"] }, [{ header: "Name", field: "name" }]);

      assert.deepEqual(describeRows(screen).slice(0, 4), [
         "caption 1: Africa",
         "header: Name",
         "data: Eve",
         "caption 1: Asia",
      ]);
      assert.equal(describeRows(screen).filter((row) => row == "header: Name").length, 3);
   });

   it("sorts records within groups and keeps the group order", async () => {
      let { screen } = await setup({ grouping: [byContinent] }, [
         { header: "Name", field: "name" },
         { header: "Visits", field: "visits", sortable: true },
      ]);

      await clickHeader(screen, "Visits");
      assert.deepEqual(
         describeRows(screen).filter((row) => !row.startsWith("footer")),
         [
            "caption 1: Africa",
            "data: Eve | 12",
            "caption 1: Asia",
            "data: Bob | 32",
            "caption 1: Europe",
            "data: Carol | 28",
            "data: Alice | 45",
            "data: Dave | 51",
         ],
      );

      await clickHeader(screen, "Visits");
      assert.deepEqual(
         describeRows(screen).filter((row) => row.startsWith("caption") || row.startsWith("data")),
         [
            "caption 1: Africa",
            "data: Eve | 12",
            "caption 1: Asia",
            "data: Bob | 32",
            "caption 1: Europe",
            "data: Dave | 51",
            "data: Alice | 45",
            "data: Carol | 28",
         ],
      );
   });

   it("reorders groups by the sorted column's aggregate with sortGroups", async () => {
      let { screen } = await setup({ grouping: [byContinent], sortGroups: true }, [
         { header: "Name", field: "name" },
         { header: "Visits", field: "visits", sortable: true, aggregate: "sum" },
      ]);
      let captions = () => describeRows(screen).filter((row) => row.startsWith("caption"));

      await clickHeader(screen, "Visits");
      assert.deepEqual(captions(), ["caption 1: Africa", "caption 1: Asia", "caption 1: Europe"]);

      await clickHeader(screen, "Visits");
      assert.deepEqual(captions(), ["caption 1: Europe", "caption 1: Asia", "caption 1: Africa"]);
   });

   it("keeps groups in the order of the records with preserveGroupOrder", async () => {
      let { screen } = await setup({ grouping: [byContinent], preserveGroupOrder: true }, [
         { header: "Name", field: "name" },
      ]);

      assert.deepEqual(
         describeRows(screen).filter((row) => row.startsWith("caption")),
         ["caption 1: Europe", "caption 1: Asia", "caption 1: Africa"],
      );
   });

   it("updates groups and aggregates when records change", async () => {
      let { store, screen } = await setup({ grouping: [byContinent] }, [
         { header: "Name", field: "name", aggregate: "count" },
      ]);

      await settle(() =>
         store.update(m.records, (records: any[]) =>
            records.map((r) => (r.name == "Bob" ? { ...r, continent: "Europe" } : r)),
         ),
      );

      assert.deepEqual(describeRows(screen), [
         "caption 1: Africa",
         "data: Eve",
         "footer 1: 1",
         "caption 1: Europe",
         "data: Alice",
         "data: Bob",
         "data: Carol",
         "data: Dave",
         "footer 1: 4",
      ]);
   });

   it("recalculates grouping with onGetGrouping when groupingParams change", async () => {
      let { store, screen } = await setup(
         {
            groupingParams: { field: m.groupBy },
            onGetGrouping: ({ field }) =>
               field ? [{ key: { value: (m.$record as any)[field] }, showCaption: true, caption: m.$group.value }] : [],
         },
         [{ header: "Name", field: "name" }],
      );
      let captions = () => describeRows(screen).filter((row) => row.startsWith("caption"));

      assert.deepEqual(captions(), []);

      await settle(() => store.set(m.groupBy, "browser"));
      assert.deepEqual(captions(), ["caption 1: Chrome", "caption 1: Edge", "caption 1: Firefox", "caption 1: Safari"]);

      await settle(() => store.set(m.groupBy, "continent"));
      assert.deepEqual(captions(), ["caption 1: Africa", "caption 1: Asia", "caption 1: Europe"]);
   });
});
