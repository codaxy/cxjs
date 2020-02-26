import { HtmlElement, Menu, Submenu, TextField } from "cx/widgets";

export default (
   <cx>
      <Menu horizontal>
         <Submenu icon="search">
            <Menu putInto="dropdown">
               <TextField value-bind="search" visited autoFocus />
            </Menu>
         </Submenu>
      </Menu>
   </cx>
);