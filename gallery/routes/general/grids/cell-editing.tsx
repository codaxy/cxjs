import {cx, Grid, Button, TextField, NumberField, Section, Select, LookupField} from "cx/widgets";
import {bind, Controller} from "cx/ui";
import casual from '../../../util/casual';

class PageController extends Controller {
   onInit() {
      //init grid data
      if (!this.store.get('$page.records')) {
         this.store.set(
            "$page.records",
            Array
               .from({length: 1000})
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
}

export default (
   <cx>
      <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/general/grids/cell-editing.js" target="_blank" putInto="github">Source Code</a>
      <Section
         mod="well"
         style="height: 100%"
         bodyStyle="display:flex; flex-direction:column"
         controller={PageController}
      >
         <Grid
            cellEditable
            onCellEdited={(change, record) => {
               console.log(change, record);
            }}
            records={bind("$page.records")}
            scrollable
            buffered
            style="flex: 1;"
            lockColumnWidths
            cached
            columns={
               [
                  {header: "#", field: "index", sortable: true, value: {bind: "$index"}},
                  {
                     header: "Name",
                     field: "fullName",
                     sortable: true,
                     editor: <cx>
                        <TextField
                           value={bind("$record.fullName")}
                           autoFocus
                           required
                           visited
                        />
                     </cx>
                  },
                  {
                     header: "Continent", field: "continent", sortable: true,
                     editor: <cx>
                        <Select
                           value={bind("$record.continent")}
                           autoFocus
                           required
                        >
                           <option value="Africa">Africa</option>
                           <option value="Antarctica">Antarctica</option>
                           <option value="Asia">Asia</option>
                           <option value="Australia">Australia</option>
                           <option value="Europe">Europe</option>
                           <option value="North America">North America</option>
                           <option value="South America">South America</option>
                        </Select>
                     </cx>
                  },
                  {
                     header: "Browser", field: "browser", sortable: true,
                     editor: <cx>
                        <LookupField
                           value={bind("$record.browser")}
                           required
                           autoOpen
                           options={[
                              { id: "Opera", text: "Opera" },
                              { id: "Safari", text: "Safari" },
                              { id: "Chrome", text: "Chrome" },
                              { id: "Firefox", text: "Firefox" },
                              { id: "Edge", text: "Edge" },
                              { id: "Internet Explorer", text: "Internet Explorer" }
                           ]}
                        />
                     </cx>
                  },
                  {
                     header: "OS", field: "os", sortable: true,
                     editor: <cx>
                        <LookupField
                           value={bind("$record.os")}
                           required
                           autoOpen
                           options={[
                              { id: "Mac OS", text: "Mac OS" },
                              { id: "iOS", text: "iOS" },
                              { id: "Android", text: "Android" },
                              { id: "Windows", text: "Windows" },
                              { id: "Ubuntu", text: "Ubuntu" },
                           ]}
                        />
                     </cx>
                  },
                  {
                     header: "Visits",
                     field: "visits",
                     sortable: true,
                     align: "right",
                     editor: <cx>
                        <NumberField
                           value={bind("$record.visits")}
                           autoFocus
                           required
                           visited
                           inputStyle="text-align: right"
                        />
                     </cx>
                  }
               ]
            }
         />
      </Section>
   </cx>
);
