import { Menu, MenuItem, Resizer, Button } from "cx/widgets";

export default (
   <cx>
      <div style="padding: 50px; display: flex;">
         <div
            style={{
               width: { expr: "{width} || 300" },
               border: "1px solid gray",
            }}
         >
            <Menu horizontal overflow>
               <MenuItem icon="search" text="Item 1">
                  <Menu putInto="dropdown">
                     <a href="#">Test</a>
                  </Menu>
               </MenuItem>
               <MenuItem icon="search" text="Item 2" onClick={() => {}} />
               <MenuItem icon="search" text="Item 3" onClick={() => {}} />
               <MenuItem icon="search" text="Item 4" onClick={() => {}} />
               <MenuItem icon="search" text="Item 5" onClick={() => {}} />
               <MenuItem icon="search" text="Item 6" onClick={() => {}} />
               <MenuItem
                  icon="search"
                  text="Item 7"
                  style="border: 1px solid red; margin-left: 5rem"
                  onClick={() => {}}
               />
            </Menu>
         </div>
         <Resizer size-bind="width" />
         <Button
            onClick={(e, { store }) => {
               store.update("width", (width) => width - 1);
            }}
         >
            -
         </Button>
         <Button
            onClick={(e, { store }) => {
               store.update("width", (width) => width + 1);
            }}
         >
            +
         </Button>
      </div>
   </cx>
);
