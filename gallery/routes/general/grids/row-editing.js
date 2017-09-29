import {cx, Grid, Button, TextField, NumberField, Section} from "cx/widgets";
import {Controller} from "cx/ui";
import casual from '../../../util/casual';

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
      <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/general/grids/row-editing.tsx" target="_blank" putInto="github">Source Code</a>
      <Section
         mod="well"
         style="height: 100%"
         bodyStyle="display:flex; flex-direction:column"
         controller={PageController}>
         <Grid
            records:bind="$page.records"
            lockColumnWidths
            cached
            scrollable
            rowStyle={{
               background: {expr: "!!{$record.$editing} ? 'rgba(128, 128, 128, 0.1)' : null"}
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
                        />
                     </cx>
                  }, {
                  header: 'Actions',
                  style: "whitespace: nowrap",
                  align:"center",
                  items: <cx>
                     <Button mod="hollow" onClick="editRow" visible:expr="!{$record.$editing}">Edit</Button>
                     <Button mod="hollow" onClick="deleteRow" visible:expr="!{$record.$editing}" confirm="Are you sure?">Delete</Button>
                     <Button mod:expr="{$root.$route.theme} == 'aquamarine' ? 'flat-primary' : 'primary'" onClick="saveRow" visible:expr="!!{$record.$editing}">Save</Button>
                     <Button mod="hollow" onClick="cancelRowEditing" visible:expr="!!{$record.$editing}">Cancel</Button>
                  </cx>
               }
               ]
            }
         />
         <br/>
         <p>
            <Button onClick="addRow">Add</Button>
         </p>
      </Section>
   </cx>
);
