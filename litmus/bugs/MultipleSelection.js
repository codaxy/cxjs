import { Checkbox, Grid, HtmlElement, Select } from "cx/widgets";
import {Controller, KeySelection, PropertySelection} from "cx/ui";
import { casual } from "../casual";
import {computable, append, filter} from "cx/data";

class PageController extends Controller {
   init() {
      super.init();

      this.store.set(
         "$page.records",
         Array.from({ length: 5000 }).map((_, index) => ({
            id: index + 1,
            fullName: casual.full_name,
            phone: casual.phone,
            city: casual.city,
            count: Math.random()
         }))
      );

      this.addTrigger("select-all-click", ["$page.selectAll"], value => {
         if (value != null) {
            if (value)
               this.store.set(
                  "selection",
                  this.store.get("$page.records").map(r => r.id)
               );
            else {
               this.store.set("selection", []);
            }
         }
      });

      this.addTrigger(
         "item-click",
         ["$page.records"],
         records => {
            if (records.every(a => a.selected))
               this.store.set("$page.selectAll", true);
            else if (records.every(a => !a.selected))
               this.store.set("$page.selectAll", false);
            else this.store.set("$page.selectAll", null);
         },
         true
      );
   }
}

export default (
   <cx>
      <div controller={PageController}>
         <Grid
            records-bind="$page.records"
            style={{ height: "100vh" }}
            scrollable
            buffered
            fixedFooter
            grouping={[{ showFooter: true, key: {}, caption: 'Test' }]}
            columns={[
               {
                  header: {
                     items: (
                        <cx>
                           <Checkbox
                              value-bind="$page.selectAll"
                              indeterminate
                              unfocusable
                           />
                        </cx>
                     ),
                     footer: 'TEST'
                  },
                  field: "selected",
                  style: "width: 1px",
                  items: (
                     <cx>
                        <Checkbox
                           value={{
                              get: computable("selection", "$record", (selection, record) => {
                                 if (!selection || !record)
                                    return false;
                                 return selection.some(id => id == record.id);
                              }),
                              set: (value, { store }) => {
                                 let record = store.get("$record");
                                 value ? store.update("selection", append, record.id) : store.update("selection", filter, id => id != record.id);
                              }
                           }}
                           unfocusable
                        />
                     </cx>
                  )
               },
               { header: "Name", field: "fullName", sortable: true },
               { header: "Phone", field: "phone" },
               { header: "City", field: "city", sortable: true },
               { header: "Count", field: "count", sortable: true, aggregate: 'sum', format: 'n;2' },
            ]}
            selection={{type: KeySelection, bind: "selection", multiple: true}}
         />
      </div>
   </cx>
);
