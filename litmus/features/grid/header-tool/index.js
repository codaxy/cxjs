import { Grid, HtmlElement, Button, Submenu, Menu, Icon } from "cx/widgets";
import { Content, Controller, KeySelection } from "cx/ui";
import { Format } from "cx/util";
import { casual } from '../../../casual';

class PageController extends Controller {
   init() {
      super.init();

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

export default (
   <cx>
      <div controller={PageController}>
         <Grid
            records:bind="$page.records"
            columns={
               [
                  {
                     header: {
                        text: "Name",
                        tool: <cx>
                           <Submenu>
                              <Icon name="drop-down" />
                              <Menu putInto="dropdown">
                                 <a>Item 1</a>
                              </Menu>
                           </Submenu>
                        </cx>
                     },
                     field: "fullName",
                     sortable: true
                  },
                  { header: "Continent", field: "continent", sortable: true },
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
            selection={{ type: KeySelection, bind: "$page.selection" }}
         />
      </div>
   </cx>
);
