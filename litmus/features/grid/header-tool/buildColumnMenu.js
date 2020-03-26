import { isString } from "util";

export function buildColumnMenu(column) {
   let result = { ...column };

   if (isString(result.header)) result.header = { text: result.header };

   if (!result.header) result.header = {};

   result.header.tool = (
      <cx>
         <Menu horizontal itemPadding="small">
            <Submenu placement="down-left">
               <span style="padding: 4px">
                  <Icon name="search" />
               </span>
               <Menu putInto="dropdown">
                  <TextField mod="menu" placeholder="Filter" />
                  <hr />
                  {visibleColumnsMenu}
               </Menu>
            </Submenu>
         </Menu>
      </cx>
   );

   return result;
}
