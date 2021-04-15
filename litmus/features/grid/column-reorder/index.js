import { computable, Controller, KeySelection, Repeater } from "cx/ui";
import { Button, DragSource, DropZone, Grid } from "cx/widgets";
import { insertElement } from "cx/data";
import { casual } from "../../../casual";

let allColumns = [
   {
      header: "Date",
      key: "date",
      field: "date",
      format: "date",
      sortable: true,
      resizable: true,
      type: "date",
      defaultWidth: 100,
      draggable: true,
   },
   {
      key: "fullName",
      header: "Name",
      field: "fullName",
      sortable: true,
      resizable: true,
      defaultWidth: 200,
      draggable: true,
   },
   {
      key: "continent",
      header: "Continent",
      field: "continent",
      sortable: true,
      resizable: true,
      defaultWidth: 150,
      draggable: true,
   },
   {
      key: "browser",
      header: "Browser",
      field: "browser",
      sortable: true,
      resizable: true,
      defaultWidth: 150,
      draggable: true,
   },
   {
      key: "os",
      header: "OS",
      field: "os",
      sortable: true,
      resizable: true,
      defaultWidth: 150,
      draggable: true,
   },
   {
      key: "visits",
      header: "Visits",
      field: "visits",
      sortable: true,
      align: "right",
      type: "number",
      defaultWidth: 100,
      draggable: true,
   },
];
class PageController extends Controller {
   onInit() {
      //init grid data
      this.store.init("$page.records", this.getRandomData());

      this.store.init(
         "$page.columnOrder",
         allColumns.map((x) => x.field)
      );

      this.store.init("$page.unusedColumns", []);
   }

   onGenerate() {
      this.store.set("$page.records", this.getRandomData());
   }

   getRandomData() {
      return Array.from({ length: 100 }).map((v, i) => ({
         id: i + 1,
         fullName: casual.full_name,
         continent: casual.continent,
         browser: casual.browser,
         os: casual.operating_system,
         visits: casual.integer(1, 100),
         date: Date.now() + 100 * Math.random() * 86400 * 1000,
      }));
   }
}

export default (
   <cx>
      <div controller={PageController} style="padding: 20px; width: 600px">
         <div style="margin-bottom: 10px; display: flex">
            <Repeater
               records={computable("$page.unusedColumns", (columns) =>
                  columns.map((key) => allColumns.find((c) => c.key == key))
               )}
            >
               <DragSource
                  style="background: lightgray; padding: 5px 10px; font-size: 12px; margin-right: 5px; cursor: pointer"
                  data={{
                     type: "unused-column",
                     key: { bind: "$record.key" },
                  }}
               >
                  <span text-bind="$record.header" />
               </DragSource>
            </Repeater>

            <DropZone
               style="background: #efefef; flex-grow: 1; padding: 5px 10px; font-size: 12px; transition: background 0.3s"
               onDropTest={(e) => e?.source?.type == "grid-column"}
               overStyle="background: yellow;"
               onDrop={(e, { store }) => {
                  let { key } = e.source.column;
                  store.update("$page.columnOrder", (colOrder) => colOrder.filter((c) => c != key));
                  store.update("$page.unusedColumns", (columns) => [...columns, key]);
               }}
            >
               Drop column here to remove it
            </DropZone>
         </div>

         <Grid
            records-bind="$page.records"
            mod="fixed-layout"
            scrollable
            buffered={false}
            style="height: 400px;"
            selection={{ type: KeySelection, bind: "$page.selection" }}
            lockColumnWidths
            columnParams-bind="$page.columnOrder"
            onGetColumns={(columnOrder) => columnOrder.map((key) => allColumns.find((c) => c.key == key))}
            onColumnDropTest={(e, instance) =>
               (e.source.type == "grid-column" && e.source.gridInstance == instance) ||
               e.source?.data.type == "unused-column"
            }
            onColumnDrop={(e, { store }) => {
               let key = e.source.type == "grid-column" ? e.source.column.key : e.source.data.key;
               let { index } = e.target;
               let columnOrder = store.get("$page.columnOrder");
               let at = columnOrder.indexOf(key);
               let result = columnOrder.filter((c) => c != key);
               if (at >= 0 && at < index) index--;
               result = insertElement(result, index, key);
               store.set("$page.columnOrder", result);
               store.update("$page.unusedColumns", (unused) => unused.filter((c) => c != key));
            }}
         />

         <Button style="margin-top: 10px" onClick="onGenerate">
            Generate
         </Button>
      </div>
   </cx>
);
