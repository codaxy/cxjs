import {
   Grid,
   HtmlElement,
   Icon,
   Menu,
   MenuItem,
   Submenu,
   TextField
} from "cx/widgets";
import { computable } from "cx/data";
import { Controller } from "cx/ui";
import { debounce } from "cx/util";

let records = [
   {
      name: "Rusty Daniel",
      email: "rusty.daniel@example.com",
      phone: "431-183-9073",
      city: "Gerhardchester"
   },
   {
      name: "Trevion Sipes",
      email: "trevion.sipes@example.com",
      phone: "715-867-2386",
      city: "Doloresview"
   },
   {
      name: "Shanon Braun",
      email: "shanon.braun@example.com",
      phone: "919-655-8944",
      city: "Ivybury"
   },
   {
      name: "Marilyne Welch",
      email: "marilyne.welch@example.com",
      phone: "359-208-1813",
      city: "Hilllbury"
   }
];

class AppController extends Controller {
   onInit() {
      this.store.init("filter", {
         enabled: { name: false },
         values: { name: null }
      });

      this.addTrigger("onFilterValues", ["filter.values"], v =>
         this.onColumnsFilter(v)
      );

      this.addTrigger("onFilter", ["filter"], ::this.load, true);
   }

   load() {
      let { filter } = this.store.getData();

      let n = 0;
      let $records = [];

      while (n <= 20) {
         $records = [...$records, ...records];
         n++;
      }

      console.log("records", $records);

      if (filter.enabled.name && filter.values.name) {
         $records = $records.filter(
            a => !!a.name.toLowerCase().includes(filter.values.name.toLowerCase())
         );
      }
      document.activeElement.focus();
      this.store.set("records", $records);
   }

   onColumnsFilter(values) {
      console.log("triggered");
      for (let v in values) {
         let enabled = !!values[v];
         console.log("isEnabled", !!values[v]);
         this.store.set(`filter.enabled.${v}`, enabled);
      }
   }
}

export default (
   <cx>
      <main controller={AppController}>
         <Grid
            records:bind="records"
            scrollable
            lockColumnWidths
            style="height: 600px;"
            columns={[
               {
                  header: {
                     text: "Name",
                     tool: (
                        <cx>
                           <Menu horizontal>
                              <Submenu placement="down-left">
                                 <MenuItem style="padding: 4px">
                                    <Icon name="search" />
                                 </MenuItem>
                                 <Menu putInto="dropdown" icons mod="menu">
                                    <Submenu
                                       arrow
                                       checked:bind="filter.enabled.name"
                                       text="Filter"
                                    >
                                       <Menu putInto="dropdown">
                                          <TextField
                                             mod="menu"
                                             value={{bind: "filter.values.name", debounce: 300}}
                                          />
                                       </Menu>
                                    </Submenu>
                                    <MenuItem
                                       text="Clear All"
                                       icon="remove"
                                       autoClose={true}
                                       onClick={(e, { store }) => {
                                          store.set("filter", { enabled: {}, values: {}});
                                       }}
                                       visible={computable(
                                          "filter.enabled",
                                          enabled =>
                                             enabled &&
                                             Object.entries(enabled).some(e => e[1] === true)
                                       )}
                                    />
                                 </Menu>
                              </Submenu>
                           </Menu>
                        </cx>
                     )
                  },
                  field: "name",
                  sortable: true
               },
               {
                  field: "email",
                  header: "Email"
               }
            ]}
         />
      </main>
   </cx>
);
