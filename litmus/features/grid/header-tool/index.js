import { Grid, HtmlElement, Button, Submenu, Menu, Icon, Checkbox, TextField} from "cx/widgets";
import { Content, Controller, KeySelection, bind } from "cx/ui";
import { Format } from "cx/util";
import { casual } from '../../../casual';

class PageController extends Controller {
   init() {
      super.init();

      this.store.init('$page.grid', {
         columns: {
            name: { visible: true },
            continent: { visible: true },
            browser: { visible: true },
            os: { visible: true },
            visits: { visible: true },
         }
      });


      //init grid data
      this.store.init(
         "$page.records",
         Array
            .from({ length: 100 })
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

const visibleColumnsMenu = <cx>
   <Submenu arrow>
      Columns
      <Menu putInto="dropdown">
         <Checkbox value-bind="$page.grid.columns.name.visible" mod="menu" disabled>Name</Checkbox>
         <Checkbox value-bind="$page.grid.columns.continent.visible" mod="menu">Continent</Checkbox>
         <Checkbox value-bind="$page.grid.columns.browser.visible" mod="menu">Browser</Checkbox>
         <Checkbox value-bind="$page.grid.columns.os.visible" mod="menu">OS</Checkbox>
         <Checkbox value-bind="$page.grid.columns.visits.visible" mod="menu">Visits</Checkbox>
      </Menu>
   </Submenu>
</cx>;

export default (
   <cx>
      <div controller={PageController} style="padding: 20px">
         <Grid
            records-bind="$page.records"
            scrollable
            style="height: 400px"
            columns={
               [
                  {
                     header: {
                        text: "Name",
                        tool: <cx>
                           <Menu horizontal itemPadding="small">
                              <Submenu placement="down-left">
                                 <span style="padding: 4px">
                                    <Icon name="search" />
                                 </span>
                                 <Menu putInto="dropdown">
                                    <TextField mod="menu" placeholder="Filter" />
                                    <hr/>
                                    {visibleColumnsMenu}
                                 </Menu>
                              </Submenu>
                           </Menu>
                        </cx>
                     },
                     field: "fullName",
                     visible: bind('$page.grid.columns.name.visible'),
                     sortable: true,
                     resizable: true,
                     width: { bind: 'colWidths.fullName' }
                  },
                  { header: "Continent", field: "continent", sortable: true, visible: bind('$page.grid.columns.continent.visible'), resizable: true },
                  { header: "Browser", field: "browser", sortable: true, visible: bind('$page.grid.columns.browser.visible'), resizable: true },
                  { header: "OS", field: "os", sortable: true, visible: bind('$page.grid.columns.os.visible'), resizable: true },
                  {
                     header: "Visits",
                     field: "visits",
                     sortable: true,
                     align: "right",
                     visible: bind('$page.grid.columns.visits.visible'),
                  }
               ]
            }
            selection={{ type: KeySelection, bind: "$page.selection" }}
            onColumnResize={data => {
               console.log(data);
            }}
         />
      </div>
   </cx>
);
