// Buffered grids render only the rows around the scroll position; the rest of the scroll height is reserved
// with table margins. Row heights come from the grid styles, so the styles are loaded.
import "../../index.scss";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import assert from "assert";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { KeySelection } from "../../ui/selection/KeySelection";
import { Grid, GridConfig, GridFetchRecordsResult } from "./Grid";
import { render, settle, RenderResult } from "../../util/test/render";

interface Model {
   records: { id: number; name: string; rank: number }[];
   selection: number;
}

const m = createModel<Model>();

const N = 1000;
let records = Array.from({ length: N }, (_, i) => ({ id: i + 1, name: "Name " + (i + 1), rank: N - i }));

async function setup(gridProps: Partial<GridConfig> = {}) {
   let store = new Store({ data: { records } });
   let screen = await render(
      <cx>
         <Grid
            records={m.records}
            keyField="id"
            buffered
            style="height: 300px"
            columns={[
               { header: "Name", field: "name" },
               { header: "Rank", field: "rank", sortable: true },
            ]}
            {...gridProps}
         />
      </cx>,
      { store },
   );
   await waitForGrid();
   return { store, screen };
}

// the grid measures rows and adjusts the buffer after rendering and on scroll events
async function waitForGrid() {
   for (let i = 0; i < 3; i++) {
      await new Promise((resolve) => setTimeout(resolve, 30));
      await settle();
   }
}

function scroller(screen: RenderResult) {
   return screen.container.querySelector(".cxe-grid-scroll-area") as HTMLElement;
}

function dataRows(screen: RenderResult) {
   return Array.from(scroller(screen).querySelectorAll("tbody.cxe-grid-data"));
}

function renderedKeys(screen: RenderResult) {
   return dataRows(screen).map((tbody) => Number(tbody.getAttribute("data-record-key")));
}

function visibleKeys(screen: RenderResult) {
   let area = scroller(screen).getBoundingClientRect();
   return dataRows(screen)
      .filter((tbody) => {
         let r = tbody.getBoundingClientRect();
         return r.bottom > area.top + 1 && r.top < area.bottom - 1;
      })
      .map((tbody) => Number(tbody.getAttribute("data-record-key")));
}

async function scrollTo(screen: RenderResult, top: number) {
   await settle(() => {
      scroller(screen).scrollTop = top;
   });
   await waitForGrid();
}

// Scrollable grids render the header twice: in the table, for column sizes, and in the visible fixed header,
// which comes last. A text locator is used because Vitest 5.1 cannot click <th> elements (see CLAUDE.md).
async function clickHeader(screen: RenderResult, text: string) {
   await settle(() => screen.getByText(text, { exact: true }).last().click());
}

function rowHeight(screen: RenderResult) {
   return dataRows(screen)[0].getBoundingClientRect().height;
}

describe("Grid buffering", () => {
   it("renders only a window of rows and reserves the scroll height of all rows", async () => {
      let { screen } = await setup();

      assert.equal(renderedKeys(screen).length, 60);
      assert.deepEqual(renderedKeys(screen).slice(0, 3), [1, 2, 3]);
      let expectedHeight = rowHeight(screen) * N;
      let { scrollHeight } = scroller(screen);
      assert.ok(
         Math.abs(scrollHeight - expectedHeight) < rowHeight(screen) * 2,
         `${scrollHeight} vs ${expectedHeight}`,
      );
   });

   it("renders the rows at the scroll position", async () => {
      let { screen } = await setup();
      let height = rowHeight(screen);

      for (let index of [200, 500, N - 5]) {
         await scrollTo(screen, index * height);

         let visible = visibleKeys(screen);
         assert.ok(visible.length > 5, `rows visible at ${index}`);
         assert.ok(
            Math.abs(visible[0] - Math.min(index + 1, N - visible.length + 1)) <= 1,
            `first visible ${visible[0]}`,
         );
         assert.ok(renderedKeys(screen).length <= 60);
      }
      assert.equal(visibleKeys(screen).at(-1), N);
   });

   it("sorts all records, not only the rendered ones", async () => {
      let { screen } = await setup();
      await scrollTo(screen, 300 * rowHeight(screen));

      await clickHeader(screen, "Rank");
      await scrollTo(screen, 0);

      // ranks are descending in the data, so ascending order starts with the last record
      assert.deepEqual(visibleKeys(screen).slice(0, 3), [N, N - 1, N - 2]);
   });

   it("updates rendered rows when their records change", async () => {
      let { store, screen } = await setup();
      await scrollTo(screen, 500 * rowHeight(screen));
      let id = visibleKeys(screen)[2];

      await settle(() =>
         store.update(m.records, (records: any[]) => records.map((r) => (r.id == id ? { ...r, name: "Changed" } : r))),
      );

      let tbody = scroller(screen).querySelector(`tbody[data-record-key="${id}"]`)!;
      assert.equal(tbody.querySelector("td")!.textContent, "Changed");
   });

   it("selects rows and moves the cursor beyond the rendered window, scrolling it into view", async () => {
      let { store, screen } = await setup({ selection: { type: KeySelection, bind: m.selection } });

      await settle(() => userEvent.click(screen.getByText("Name 3", { exact: true }).element()));
      assert.equal(store.get(m.selection), 3);

      for (let i = 0; i < 70; i++) await settle(() => userEvent.keyboard("{ArrowDown}"));
      await settle(() => userEvent.keyboard("{Enter}"));
      await waitForGrid();

      assert.equal(store.get(m.selection), 73);
      assert.ok(visibleKeys(screen).includes(73), `visible: ${visibleKeys(screen)}`);
   });
});

describe("Grid infinite loading", () => {
   let all = Array.from({ length: 500 }, (_, i) => ({ id: i + 1, name: "Name " + (i + 1) }));

   async function setupInfinite() {
      let requests: { page: number; pageSize: number; sorters?: any }[] = [];
      let screen = await render(
         <cx>
            <Grid
               infinite
               buffered
               keyField="id"
               style="height: 300px"
               columns={[{ header: "Name", field: "name", sortable: true }]}
               onFetchRecords={({ page, pageSize, sorters }) => {
                  requests.push({ page, pageSize, sorters });
                  let start = (page - 1) * pageSize;
                  return new Promise<GridFetchRecordsResult<any>>((resolve) =>
                     setTimeout(
                        () => resolve({ records: all.slice(start, start + pageSize), totalRecordCount: all.length }),
                        5,
                     ),
                  );
               }}
            />
         </cx>,
      );
      await waitForGrid();
      return { screen, requests };
   }

   it("fetches the first page and reserves the scroll height of all records", async () => {
      let { screen, requests } = await setupInfinite();

      assert.deepEqual(requests, [{ page: 1, pageSize: 100, sorters: undefined }]);
      assert.deepEqual(visibleKeys(screen).slice(0, 3), [1, 2, 3]);
      let expectedHeight = rowHeight(screen) * all.length;
      assert.ok(Math.abs(scroller(screen).scrollHeight - expectedHeight) < rowHeight(screen) * 2);
   });

   it("fetches the pages at the scroll position", async () => {
      let { screen, requests } = await setupInfinite();
      requests.length = 0;

      await scrollTo(screen, 300 * rowHeight(screen));
      await expect.poll(() => visibleKeys(screen)[0]).toBe(301);

      assert.deepEqual(
         requests.map((r) => r.page),
         [3, 4],
      );
   });

   it("fetches the first page again with the sorters when the grid is sorted", async () => {
      let { screen, requests } = await setupInfinite();
      await scrollTo(screen, 300 * rowHeight(screen));
      requests.length = 0;

      await clickHeader(screen, "Name");
      await waitForGrid();

      // compared as JSON, which is what a server receives (sorters also carry keys with undefined values)
      assert.deepEqual(JSON.parse(JSON.stringify(requests)), [
         { page: 1, pageSize: 100, sorters: [{ field: "name", direction: "ASC" }] },
      ]);
      assert.equal(scroller(screen).scrollTop, 0);
   });
});
