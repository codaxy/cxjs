import {
   Grid,
   HtmlElement,
   Button,
   Checkbox,
   TextField,
   Slider,
} from "cx/widgets";
import { Controller, KeySelection, bind, ContentResolver } from "cx/ui";
import { casual } from "../../casual";

/*
 * Test harness for left/right (and mixed) fixed columns.
 *
 * Columns are tagged with `fixed: "left"` and `fixed: "right"`. Until RHS
 * freezing is implemented, every truthy `fixed` value is treated as a
 * left-freeze, so the "right" columns will currently pile up on the LEFT.
 * Once the feature lands they should split to the right edge.
 *
 * Use the toggles to exercise the feature against the tricky grid modes:
 * buffering, grouping, fixed footer, cell editing, selection and column
 * resizing - individually and in combination.
 */

const MAX_ROWS = 5000;

class PageController extends Controller {
   onInit() {
      this.store.init("$page.options", {
         buffered: false,
         grouping: false,
         fixedFooter: false,
         cellEditing: false,
         selection: false,
         resizable: true,
         vlines: true,
         rowCount: 100,
      });

      if (!this.store.get("$page.allRecords")) this.shuffle();

      // The grid shows a live slice of the generated pool, so changing the row
      // count never regenerates data.
      this.addComputable("$page.records", ["$page.allRecords", "$page.options.rowCount"], (all, count) =>
         all ? all.slice(0, count) : []
      );
   }

   shuffle() {
      this.store.set(
         "$page.allRecords",
         Array.from({ length: MAX_ROWS }).map((v, i) => ({
            id: i + 1,
            fullName: casual.full_name,
            continent: casual.continent,
            country: casual.country,
            city: casual.city,
            browser: casual.browser,
            os: casual.operating_system,
            visits: casual.integer(1, 100),
            score: casual.integer(0, 1000),
            amount: casual.integer(100, 100000),
            status: casual.random_element(["Active", "Pending", "Closed"]),
         }))
      );
   }
}

function buildGrouping({ grouping, fixedFooter }) {
   if (!grouping) {
      // fixedFooter without grouping still works via column aggregates
      return undefined;
   }
   if (fixedFooter) {
      // First grouping level must group ALL data (key omitted) when a fixed
      // footer is present - see Grid.tsx guard.
      return [
         { showFooter: true },
         {
            key: { continent: { bind: "$record.continent" } },
            showCaption: true,
            showFooter: true,
         },
      ];
   }
   return [
      {
         key: { continent: { bind: "$record.continent" } },
         showCaption: true,
         showFooter: true,
      },
   ];
}

const filler = (header, field) => ({
   header,
   field,
   sortable: true,
   resizable: true,
});

export default (
   <cx>
      <div controller={PageController} style="padding: 20px">
         <div style="display:flex; flex-wrap:wrap; gap:16px; align-items:center; margin-bottom:12px">
            <Button onClick="shuffle">Shuffle</Button>
            <Checkbox value-bind="$page.options.buffered">Buffered</Checkbox>
            <Checkbox value-bind="$page.options.grouping">Grouping</Checkbox>
            <Checkbox value-bind="$page.options.fixedFooter">Fixed footer</Checkbox>
            <Checkbox value-bind="$page.options.cellEditing">Cell editing</Checkbox>
            <Checkbox value-bind="$page.options.selection">Selection</Checkbox>
            <Checkbox value-bind="$page.options.resizable">Resizable</Checkbox>
            <Checkbox value-bind="$page.options.vlines">V-lines</Checkbox>
            <div style="display:flex; align-items:center; gap:8px">
               Rows:
               <Slider
                  value={{ bind: "$page.options.rowCount", debounce: 200 }}
                  minValue={10}
                  maxValue={MAX_ROWS}
                  step={10}
                  style="width:160px"
               />
               <span text-bind="$page.options.rowCount" />
            </div>
         </div>

         <ContentResolver
            params-bind="$page.options"
            onResolve={(options = {}) => {
               let {
                  buffered,
                  grouping,
                  fixedFooter,
                  cellEditing,
                  selection,
                  resizable,
                  vlines,
               } = options;

               let columns = [
                  // ---- LEFT FIXED ----
                  {
                     header: { text: "#", rowSpan: 2 },
                     field: "index",
                     value: { bind: "$index" },
                     fixed: "left",
                     resizable,
                     aggregate: "count",
                     align: "right",
                  },
                  {
                     header: { text: "Name", rowSpan: 2 },
                     field: "fullName",
                     sortable: true,
                     fixed: "left",
                     resizable,
                     editor: (
                        <cx>
                           <TextField
                              value-bind="$record.fullName"
                              style="width: 100%"
                              autoFocus
                              required
                              visited
                           />
                        </cx>
                     ),
                  },
                  {
                     // Left-frozen action column with a taller cell (icon button)
                     // to confirm the same row-height desync happens on the LEFT.
                     header: { text: "", rowSpan: 2 },
                     fixed: "left",
                     align: "center",
                     resizable: false,
                     items: (
                        <cx>
                           <Button
                              mod="hollow"
                              icon="menu"
                              onClick={(e, { store }) => {
                                 let r = store.get("$record");
                                 console.log("Left action:", r.id, r.fullName);
                              }}
                           />
                        </cx>
                     ),
                  },
                  // ---- SCROLLING ----
                  {
                     header: "Continent",
                     field: "continent",
                     sortable: true,
                     resizable,
                     aggregate: "count",
                  },
                  filler("Country", "country"),
                  filler("City", "city"),
                  filler("Browser", "browser"),
                  filler("OS", "os"),
                  filler("Browser 2", "browser"),
                  filler("OS 2", "os"),
                  filler("Country 2", "country"),
                  filler("City 2", "city"),
                  {
                     header: "Amount",
                     field: "amount",
                     sortable: true,
                     align: "right",
                     resizable,
                     aggregate: "sum",
                     format: "currency;USD",
                     editor: (
                        <cx>
                           <TextField value-bind="$record.amount" style="width: 100%" />
                        </cx>
                     ),
                  },
                  // ---- RIGHT FIXED ----
                  {
                     header: { text: "Visits", rowSpan: 2 },
                     field: "visits",
                     sortable: true,
                     align: "right",
                     fixed: "right",
                     resizable,
                     aggregate: "sum",
                  },
                  {
                     header: { text: "Score", rowSpan: 2 },
                     field: "score",
                     sortable: true,
                     align: "right",
                     fixed: "right",
                     resizable,
                     aggregate: "avg",
                  },
                  {
                     header: { text: "Status", rowSpan: 2 },
                     field: "status",
                     sortable: true,
                     fixed: "right",
                     resizable,
                  },
                  {
                     header: { text: "", rowSpan: 2 },
                     fixed: "right",
                     align: "center",
                     resizable: false,
                     items: (
                        <cx>
                           <Button
                              mod="hollow"
                              icon="menu"
                              onClick={(e, { store }) => {
                                 let r = store.get("$record");
                                 console.log("Row action:", r.id, r.fullName);
                              }}
                           />
                        </cx>
                     ),
                  },
               ];

               return (
                  <cx>
                     <Grid
                        records-bind="$page.records"
                        keyField="id"
                        scrollable
                        buffered={buffered}
                        fixedFooter={fixedFooter}
                        cellEditable={cellEditing}
                        vlines={vlines}
                        cached
                        mod="fixed-layout"
                        style="height: 600px; width: 900px"
                        grouping={buildGrouping({ grouping, fixedFooter })}
                        selection={
                           selection && {
                              type: KeySelection,
                              bind: "$page.selectedRecordId",
                           }
                        }
                        onCellEdited={(data, record) => {
                           console.log("cell edited", data, record);
                        }}
                        columns={columns}
                     />
                  </cx>
               );
            }}
         />
      </div>
   </cx>
);
