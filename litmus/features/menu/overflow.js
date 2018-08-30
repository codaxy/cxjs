import {HtmlElement, Menu, MenuItem, Submenu, TextField, DateField, Checkbox} from 'cx/widgets';

export default <cx>
   <div style="padding: 50px">
      <Menu horizontal overflow style="width: 300px">
         <MenuItem icon="search" text="Item1">
            <Menu putInto="dropdown">
               <a href="#">Test</a>
            </Menu>
         </MenuItem>
         <MenuItem icon="search" text="Item1"  onClick={() => {}}/>
         <MenuItem icon="search" text="Item1"  onClick={() => {}}/>
         <MenuItem icon="search" text="Item1"  onClick={() => {}}/>
         <MenuItem icon="search" text="Item1"  onClick={() => {}}/>
         <MenuItem icon="search" text="Item1"  onClick={() => {}}/>
         <MenuItem icon="search" text="Item1"  onClick={() => {}}/>
      </Menu>
   </div>
</cx>