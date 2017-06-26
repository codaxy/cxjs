import {HtmlElement, Menu, MenuItem, Submenu, TextField, DateField, Checkbox} from 'cx/widgets';

export default <cx>
   <div style="padding: 50px">
      <Menu horizontal>
         <Submenu>
            File
            <Menu putInto="dropdown" icons>
               <MenuItem checked:bind="checked">
                  <a href="#">Link</a>
               </MenuItem>
               <hr/>
               <MenuItem icon="search" hideCursor>
                  <TextField value:bind="$page.text" mod="menu" />
               </MenuItem>
               <TextField value:bind="$page.text" mod="menu"/>
               <Checkbox value:bind="$page.checked" mod="menu">Checkbox</Checkbox>
               <Submenu arrow checked:bind="checked">
                  Submenu 1
                  <Menu putInto="dropdown">
                     <a href="#">Item 1</a>
                     <a href="#">Item 2</a>
                  </Menu>
               </Submenu>
               <Submenu arrow>
                  Submenu 2
                  <Menu putInto="dropdown">
                     <a href="#">Item 1</a>
                     <a href="#">Item 2</a>
                  </Menu>
               </Submenu>
               <DateField value:bind="$page.date" mod="menu"/>
               <MenuItem mod="active" class="test" style="color:red;" autoClose>
                  <a href="#">Item Level CSS</a>
               </MenuItem>
            </Menu>
         </Submenu>
         <Submenu>
            Edit
            <Menu putInto="dropdown">
               <a href="#">Link</a>
               <hr/>
               <TextField value:bind="$page.text" mod="menu"/>
               <Checkbox value:bind="$page.checked" mod="menu">Checkbox</Checkbox>
               <Submenu icon="check">
                  Submenu 1
                  <Menu putInto="dropdown">
                     <a href="#" class="cxm-menu-pad">Item 1</a>
                     <a href="#" class="cxm-menu-pad">Item 2</a>
                  </Menu>
               </Submenu>
               <Submenu>
                  Submenu 2
                  <Menu putInto="dropdown">
                     <a href="#" class="cxm-menu-pad">Item 1</a>
                     <a href="#" class="cxm-menu-pad">Item 2</a>
                  </Menu>
               </Submenu>
            </Menu>
         </Submenu>
      </Menu>
   </div>
</cx>