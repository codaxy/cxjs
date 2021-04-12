import { Grid, HtmlElement, Button, Submenu, Menu, Icon, Checkbox, TextField } from "cx/widgets";
import { Content, Controller, KeySelection, bind } from "cx/ui";
import { Format } from "cx/util";
import { casual } from "../../../casual";
import { buildColumnMenus } from "./buildColumnMenu";

class PageController extends Controller {
   init() {
      super.init();

      this.store.init("$page.grid", {
         columns: {
            name: { visible: true },
            continent: { visible: true },
            browser: { visible: true },
            os: { visible: true },
            visits: { visible: true },
            date: { visible: true },
         },
      });

      //init grid data
      this.store.init(
         "$page.records",
         Array.from({ length: 100 }).map((v, i) => ({
            id: i + 1,
            fullName: casual.full_name,
            continent: casual.continent,
            browser: casual.browser,
            os: casual.operating_system,
            visits: casual.integer(1, 100),
            date: Date.now() + 100 * Math.random() * 86400 * 1000,
         }))
      );
   }
}

const visibleColumnsMenu = (
   <cx>
      <Submenu arrow>
         Columns
         <Menu putInto="dropdown">
            <Checkbox value-bind="$page.grid.columns.name.visible" mod="menu" disabled>
               Name
            </Checkbox>
            <Checkbox value-bind="$page.grid.columns.continent.visible" mod="menu">
               Continent
            </Checkbox>
            <Checkbox value-bind="$page.grid.columns.browser.visible" mod="menu">
               Browser
            </Checkbox>
            <Checkbox value-bind="$page.grid.columns.os.visible" mod="menu">
               OS
            </Checkbox>
            <Checkbox value-bind="$page.grid.columns.visits.visible" mod="menu">
               Visits
            </Checkbox>
         </Menu>
      </Submenu>
   </cx>
);

let { columns, filterParams, onCreateFilter } = buildColumnMenus(
   [
      {
         header: "Date",
         field: "date",
         format: "date",
         visible: bind("$page.grid.columns.date.visible"),
         sortable: true,
         resizable: true,
         type: "date",
         defaultWidth: 100,
      },
      {
         header: "Name",
         field: "fullName",
         visible: bind("$page.grid.columns.name.visible"),
         sortable: true,
         resizable: true,
         defaultWidth: 200,
      },
      {
         header: "Continent",
         field: "continent",
         sortable: true,
         visible: bind("$page.grid.columns.continent.visible"),
         resizable: true,
         defaultWidth: 150,
      },
      {
         header: "Browser",
         field: "browser",
         sortable: true,
         visible: bind("$page.grid.columns.browser.visible"),
         resizable: true,
         defaultWidth: 150,
      },
      {
         header: "OS",
         field: "os",
         sortable: true,
         visible: bind("$page.grid.columns.os.visible"),
         resizable: true,
         defaultWidth: 150,
      },
      {
         header: "Visits",
         field: "visits",
         sortable: true,
         align: "right",
         type: "number",
         visible: bind("$page.grid.columns.visits.visible"),
         defaultWidth: 100,
      },
   ],
   {
      filterPath: "$page.filter",
      items: visibleColumnsMenu,
   }
);

export default (
   <cx>
      <div controller={PageController} style="padding: 20px">
         <Grid
            records-bind="$page.records"
            mod="fixed-layout"
            scrollable
            style="height: 400px; width: 600px"
            columns={columns}
            filterParams={filterParams}
            onCreateFilter={onCreateFilter}
            selection={{ type: KeySelection, bind: "$page.selection" }}
            lockColumnWidths
            onColumnResize={(data) => {
               console.log(data);
            }}
         />
      </div>
   </cx>
);
