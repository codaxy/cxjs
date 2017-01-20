import {
   Checkbox,
   Grid,
   HtmlElement,
   Menu,
   MenuItem,
   Submenu
} from "cx/widgets";

export const App = (
   <cx>
      <div>
         <Menu horizontal>
            <Submenu arrow>
               <a>Visible Columns...</a>
               <Menu putInto="dropdown" itemPadding="small">
                  <Checkbox
                     value={{ bind: "visibleColumns.col1", defaultValue: true }}
                     mod="menu"
                  >
                     Col1
                  </Checkbox>
                  <Checkbox
                     value={{ bind: "visibleColumns.col2", defaultValue: true }}
                     mod="menu"
                  >
                     Col2
                  </Checkbox>
                  <Checkbox
                     value={{ bind: "visibleColumns.col3", defaultValue: true }}
                     mod="menu"
                  >
                     Col3
                  </Checkbox>
                  <Checkbox
                     value={{ bind: "visibleColumns.col4", defaultValue: true }}
                     mod="menu"
                  >
                     Col4
                  </Checkbox>
                  <Checkbox
                     value={{ bind: "visibleColumns.col5", defaultValue: true }}
                     mod="menu"
                  >
                     Col5
                  </Checkbox>
               </Menu>
            </Submenu>
         </Menu>
         <br />
         <Grid
            columns={
               [
                  {
                     header: "Col1",
                     field: "col1",
                     visible: { bind: "visibleColumns.col1" },
                     format: "n;2"
                  },
                  {
                     header: "Col2",
                     field: "col2",
                     visible: { bind: "visibleColumns.col2" },
                     format: "n;2"
                  },
                  {
                     header: "Col3",
                     field: "col3",
                     visible: { bind: "visibleColumns.col3" }
                  },
                  {
                     header: "Col4",
                     field: "col4",
                     visible: { bind: "visibleColumns.col4" }
                  },
                  {
                     header: "Col5",
                     field: "col5",
                     visible: { bind: "visibleColumns.col5" }
                  }
               ]
            }
            records={
               Array.from({ length: 1 }, x => ({
                  col1: 1,
                  col2: Math.random(),
                  col3: 'X',
                  col4: 'Y',
                  col5: 'Z'
               }))
            }
         />
      </div>
   </cx>
);
