import { Grid, HtmlElement, Button, Submenu, Menu, Icon, Checkbox, TextField} from "cx/widgets";
import { Content, Controller, KeySelection, bind } from "cx/ui";
import { Format } from "cx/util";
import { casual } from '../../casual';

class PageController extends Controller {
   onInit() {
      this.store.init('$page.grid', {
         columns: {
            name: {visible: true},
            continent: {visible: true}
         }
      });

      //init grid data
      if (!this.store.get('$page.records'))
         this.shuffle();
   }

   shuffle() {
      this.store.set(
         "$page.records",
         Array
            .from({ length: 1000 })
            .map((v, i) => ({
               id: i + 1,
               fullName: casual.full_name,
               continent: casual.continent,
               browser: casual.browser,
               os: casual.operating_system,
               visits: casual.integer(1, 100)
            }))
      );
   }
}

export default (
   <cx>
      <div controller={PageController} style="padding: 20px">
         <p>
            <Button onClick="shuffle">Shuffle</Button>
         </p>
         <Grid
            records:bind="$page.records"
            scrollable
            //buffered
            style="height: 800px;"
            lockColumnWidths
            cached
            columns={
               [
                  { header: "#", field: "index", sortable: true, value: {bind: "$index"} },
                  {
                     header: {
                        text: "Name"
                     },
                     field: "fullName",
                     visible: bind('$page.grid.columns.name.visible'),
                     sortable: true,
                     editor: <cx>
                        <TextField value-bind="$record.fullName" style="width: 100%" autoFocus required visited />
                     </cx>
                  },
                  { header: "Continent", field: "continent", sortable: true,
                     editor: <cx>
                        <TextField value-bind="$record.continent" style="width: 100%" autoFocus />
                     </cx> },
                  { header: "Browser", field: "browser", sortable: true },
                  { header: "OS", field: "os", sortable: true },
                  {
                     header: "Visits",
                     field: "visits",
                     sortable: true,
                     align: "right"
                  }
               ]
            }
            cellEditable
            onCellEdited={(data, record) => {
               console.log(data, record);
            }}
         />
      </div>
   </cx>
);
