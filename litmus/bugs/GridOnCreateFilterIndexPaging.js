import { Controller } from "cx/ui";
import { Grid, NumberField, TextField } from "cx/widgets";

class AppController extends Controller {
   onInit() {
      this.store.init(
         "$page.records",
         Array.from({ length: 100 }).map((_, i) => ({
            id: i + 1,
            name: `Record ${i + 1}`
         }))
      );

      this.store.init("$page.filter", {
         name: "",
         page: 1
      });
   }
}

export default (
   <cx>
      <main controller={AppController}>
         <div style="display:flex; gap:12px; margin-bottom:12px;">
            <TextField
               value-bind="$page.filter.name"
               placeholder="Filter by name..."
               style="width:240px"
            />
            <NumberField
               value-bind="$page.filter.page"
               min={1}
               max={10}
               required
               style="width:120px"
            />
         </div>

         <Grid
            records-bind="$page.records"
            filterParams-bind="$page.filter"
            onCreateFilter={(filter) => {
               const pageSize = 10;
               const page = Math.max(1, Number(filter && filter.page) || 1);
               const start = (page - 1) * pageSize;
               const end = start + pageSize;
               const search = ((filter && filter.name) || "").toLowerCase();

               return (record, index) => {
                  if (index < start || index >= end) return false;
                  if (!search) return true;
                  return record.name.toLowerCase().includes(search);
               };
            }}
            style="height: 400px"
            scrollable
            columns={[
               { header: "#", value: { expr: "{$index} + 1" }, sortable: false },
               { header: "Id", field: "id", sortable: true },
               { header: "Name", field: "name", sortable: true }
            ]}
         />
      </main>
   </cx>
);
