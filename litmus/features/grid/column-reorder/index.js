import { ContentResolver, Controller, KeySelection } from "cx/ui";
import { Button, Grid } from "cx/widgets";
import { insertElement } from "cx/data";
import { casual } from "../../../casual";
import { column } from "cx/charts";

let allColumns = [
   {
      header: "Date",
      field: "date",
      format: "date",
      sortable: true,
      resizable: true,
      type: "date",
      defaultWidth: 100,
      draggable: true,
   },
   {
      header: "Name",
      field: "fullName",
      sortable: true,
      resizable: true,
      defaultWidth: 200,
      draggable: true,
   },
   {
      header: "Continent",
      field: "continent",
      sortable: true,
      resizable: true,
      defaultWidth: 150,
      draggable: true,
   },
   {
      header: "Browser",
      field: "browser",
      sortable: true,
      resizable: true,
      defaultWidth: 150,
      draggable: true,
   },
   {
      header: "OS",
      field: "os",
      sortable: true,
      resizable: true,
      defaultWidth: 150,
      draggable: true,
   },
   {
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
      <div controller={PageController} style="padding: 20px">
         <Grid
            records-bind="$page.records"
            mod="fixed-layout"
            scrollable
            style="height: 400px; width: 600px"
            selection={{ type: KeySelection, bind: "$page.selection" }}
            lockColumnWidths
            columnParams-bind="$page.columnOrder"
            onGetColumns={(columnOrder) => columnOrder.map((field) => allColumns.find((c) => c.field == field))}
            onColumnDropTest={(e, instance) => e.source.type == "grid-column" && e.source.gridInstance == instance}
            onColumnDrop={(e, { store }) => {
               let { field } = e.source.column;
               let { index } = e.target;
               let columnOrder = store.get("$page.columnOrder");
               let at = columnOrder.indexOf(field);
               let result = columnOrder.filter((c) => c != field);
               if (at >= 0 && at < index) index--;
               result = insertElement(result, index, field);
               store.set("$page.columnOrder", result);
            }}
         />

         <Button onClick="onGenerate">Generate</Button>
      </div>
   </cx>
);
