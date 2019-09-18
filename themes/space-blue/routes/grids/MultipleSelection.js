import {Checkbox, Grid, HtmlElement, Select} from "cx/widgets";
import {Content, Controller, PropertySelection} from "cx/ui";
import {getComparer} from "cx/data";

import {casual} from 'shared/data/casual';

class PageController extends Controller {
   init() {
      super.init();

      this.store.set(
         "$page.records",
         Array
            .from({length: 20})
            .map(() => ({
               fullName: casual.full_name,
               phone: casual.phone,
               city: casual.city,
               selected: false
            }))
      );

      this.addTrigger("select-all", ["$page.selectAll"], (value, records) => {
         this.store.set(
            "$page.records",
            this.store
               .get("$page.records")
               .map(r => Object.assign({}, r, {selected: value}))
         );
      });
   }
}

export default <cx>
   <div controller={PageController}>
      <Grid
         records:bind="$page.records"
         style={{height: "532px"}}
         cached
         scrollable
         columns={
            [
               {
                  header: {
                     items: <cx><Checkbox value:bind="$page.selectAll" unfocusable/></cx>
                  },
                  field: "selected",
                  items: <cx><Checkbox value:bind="$record.selected" unfocusable/></cx>
               },
               {header: "Name", field: "fullName", sortable: true},
               {header: "Phone", field: "phone"},
               {header: "City", field: "city", sortable: true}
            ]
         }
         selection={
            {type: PropertySelection, bind: "$page.selection", multiple: true}
         }
         sorters:bind="$page.sorters"
      />
   </div>
</cx>
