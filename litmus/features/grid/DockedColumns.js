import {
   Grid,
   HtmlElement,
   Button,
   Submenu,
   Menu,
   Icon,
   Checkbox,
   TextField
} from "cx/widgets";
import {
   Content,
   Controller,
   KeySelection,
   bind,
   ContentResolver
} from "cx/ui";
import { Format } from "cx/util";
import { casual } from "../../casual";

class PageController extends Controller {
   onInit() {
      this.store.init("$page.grid", {
         columns: {
            name: { visible: true },
            continent: { visible: true }
         }
      });

      //init grid data
      if (!this.store.get("$page.records")) this.shuffle();
   }

   shuffle() {
      this.store.set(
         "$page.records",
         Array.from({ length: 100 }).map((v, i) => ({
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
            <Checkbox value-bind="options.buffered" style="margin-left: 20px">
               Buffered
            </Checkbox>
            <Checkbox
               value-bind="options.cellEditing"
               style="margin-left: 20px"
            >
               Cell editing
            </Checkbox>
            <Checkbox
               value-bind="options.fixedFooter"
               style="margin-left: 20px"
            >
               Fixed footer
            </Checkbox>
            <Checkbox value-bind="options.selection" style="margin-left: 20px">
               Selection
            </Checkbox>
         </p>
         <ContentResolver
            params-bind="options"
            onResolve={({
               buffered,
               cellEditing,
               fixedFooter,
               selection
            } = {}) => (
               <cx>
                  <Grid
                     records-bind="$page.records"
                     scrollable
                     buffered={buffered}
                     style="height: 800px; width: 800px"
                     //lockColumnWidths
                     fixedFooter={fixedFooter}
                     cached
                     vlines
                     mod="fixed-layout"
                     cellEditable={cellEditing}
                     onCreateIsRecordSelectable={() => record => record.id == 5}
                     onCellEdited={(data, record) => {
                        console.log(data, record);
                     }}
                     selection={
                        selection && {
                           type: KeySelection,
                           bind: "selectedRecordId"
                        }
                     }
                     columns={[
                        {
                           header: {
                              text: "#",
                              rowSpan: 2,
                              width: bind("test")
                           },
                           field: "index",
                           sortable: true,
                           value: { bind: "$index" },
                           fixed: true,
                           resizable: true,
                           aggregate: "count"
                        },
                        {
                           header: {
                              text: "Name",
                              rowSpan: 2
                           },

                           field: "fullName",
                           visible: bind("$page.grid.columns.name.visible"),
                           sortable: true,
                           fixed: true,
                           resizable: true,
                           editor: (
                              <cx>
                                 <TextField
                                    value-bind="$record.fullName"
                                    style="width: 100%"
                                    autoFocus
                                    required
                                    visited
                                 />
                              </cx>
                           )
                        },
                        {
                           header: "Continent",
                           header2: "Test",
                           field: "continent",
                           sortable: true,
                           resizable: true,
                           aggregate: "count",
                           editor: (
                              <cx>
                                 <TextField
                                    value-bind="$record.continent"
                                    style="width: 100%"
                                    autoFocus
                                 />
                              </cx>
                           )
                        },
                        {
                           header: "Browser",
                           field: "browser",
                           sortable: true,
                           resizable: true
                        },
                        {
                           header: "Browser",
                           field: "browser",
                           sortable: true,
                           resizable: true
                        },
                        {
                           header: "Browser",
                           field: "browser",
                           sortable: true,
                           resizable: true
                        },
                        {
                           header: "Browser",
                           field: "browser",
                           sortable: true,
                           resizable: true
                        },
                        {
                           header: "Browser",
                           field: "browser",
                           sortable: true,
                           resizable: true
                        },
                        {
                           header: "Browser",
                           field: "browser",
                           sortable: true,
                           resizable: true
                        },
                        {
                           header: "Browser",
                           field: "browser",
                           sortable: true,
                           resizable: true
                        },
                        {
                           header: "Browser",
                           field: "browser",
                           sortable: true,
                           resizable: true
                        },
                        {
                           header: "OS",
                           field: "os",
                           sortable: true,
                           resizable: true
                        },
                        {
                           header: "Visits",
                           field: "visits",
                           sortable: true,
                           align: "right",
                           resizable: true
                        }
                     ]}
                  />
               </cx>
            )}
         />
      </div>
   </cx>
);
