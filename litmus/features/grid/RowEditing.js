import {Grid, HtmlElement, Button, TextField, NumberField} from "cx/widgets";
import {Controller} from "cx/ui";
import {casual} from '../../casual';

class PageController extends Controller {
   onInit() {
      //init grid data
      if (!this.store.get('$page.records'))
         this.shuffle();
   }

   shuffle() {
      this.store.set(
         "$page.records",
         Array
            .from({length: 10})
            .map((v, i) => ({
               fullName: casual.full_name,
               continent: casual.continent,
               browser: casual.browser,
               os: casual.operating_system,
               visits: casual.integer(1, 100)
            }))
      );
   }

   editRow(e, {store}) {
      let record = store.get('$record');
      //keep old values
      store.set('$record.$editing', record);
   }

   saveRow(e, {store}) {
      store.delete('$record.$editing');
   }

   cancelRowEditing(e, {store}) {
      let oldRecord = store.get('$record.$editing');
      if (oldRecord.add)
         store.delete('$record');
      else
         store.set('$record', oldRecord);
   }

   addRow(e) {
      this.store.update('$page.records', records => [...records, {
         $editing: {add: true}
      }])
   }

   deleteRow(e, {store}) {
      store.delete('$record');
   }
}

export default (
   <cx>
      <div controller={PageController} style="padding: 20px">
         <Grid
            records:bind="$page.records"
            lockColumnWidths
            cached
            rowStyle={{
               background: {expr: "!!{$record.$editing} ? 'lightsteelblue' : null"}
            }}
            row={{
               valid: { bind: "$record.valid" }
            }}
            columns={
               [
                  {
                     header: {
                        text: "Name"
                     },
                     field: "fullName",
                     sortable: true,
                     items: <cx>
                        <TextField
                           value:bind="$record.fullName"
                           viewMode:expr="!{$record.$editing}"
                           style="width: 100%"
                           autoFocus
                           required
                        />
                     </cx>
                  },
                  {
                     header: "Continent", field: "continent", sortable: true,
                     items: <cx>
                        <TextField
                           value:bind="$record.continent"
                           viewMode:expr="!{$record.$editing}"
                           style="width: 100%"
                           required
                        />
                     </cx>
                  },
                  {
                     header: "Browser", field: "browser", sortable: true,
                     items: <cx>
                        <TextField
                           value:bind="$record.browser"
                           viewMode:expr="!{$record.$editing}"
                           style="width: 100%"
                           required
                        />
                     </cx>
                  },
                  {
                     header: "OS", field: "os", sortable: true,
                     items: <cx>
                        <TextField
                           value:bind="$record.os"
                           viewMode:expr="!{$record.$editing}"
                           style="width: 100%"
                           required
                        />
                     </cx>
                  },
                  {
                     header: "Visits",
                     field: "visits",
                     sortable: true,
                     align: "right",
                     items: <cx>
                        <NumberField
                           value:bind="$record.visits"
                           viewMode:expr="!{$record.$editing}"
                           style="width: 100%"
                           inputStyle="text-align: right"
                           required
                        />
                     </cx>
                  }, {
                  header: 'Actions',
                  style: "width: 150px",
                  align:"center",
                  items: <cx>
                     <Button mod="hollow" onClick="editRow" visible:expr="!{$record.$editing}">Edit</Button>
                     <Button mod="hollow" onClick="deleteRow" visible:expr="!{$record.$editing}" confirm="Are you sure?">Delete</Button>
                     <Button mod="primary" disabled:expr="!{$record.valid}" onClick="saveRow" visible:expr="!!{$record.$editing}">Save</Button>
                     <Button mod="hollow" onClick="cancelRowEditing" visible:expr="!!{$record.$editing}">Cancel</Button>
                  </cx>
               }
               ]
            }
         />
         <p>
            <Button onClick="addRow">Add</Button>
         </p>
      </div>
   </cx>
);
