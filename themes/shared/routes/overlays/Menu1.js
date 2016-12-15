import { DateField, Checkbox, TextField, Menu, MenuItem, Button, HtmlElement } from 'cx/widgets';

export default <cx>
   <Menu horizontal>
      <MenuItem>
         <span>File</span>
         <Menu putInto="dropdown">
            <MenuItem>
               <a href="#" onClick={e=>{ e.preventDefault(); document.activeElement.blur(); }}>Link</a>
            </MenuItem>

            <hr/>

            <TextField value:bind="$page.text" mod="menu" />
            <TextField value:bind="$page.text" mod="menu" />
            <Checkbox value:bind="$page.checked" mod="menu">Checkbox</Checkbox>
            <MenuItem arrow>
               <span>Submenu 1</span>
               <Menu putInto="dropdown">
                  <MenuItem>
                     <a href="#">Item 1</a>
                  </MenuItem>
                  <MenuItem>
                     <a href="#">Item 2</a>
                  </MenuItem>
               </Menu>
            </MenuItem>
            <MenuItem arrow>
               <span>Submenu 2</span>
               <Menu putInto="dropdown">
                  <MenuItem>
                     <a href="#">Item 1</a>
                  </MenuItem>
                  <MenuItem>
                     <a href="#">Item 2</a>
                  </MenuItem>
               </Menu>
            </MenuItem>
            <DateField value:bind="$page.date" mod="menu" />
            <MenuItem mod="active" class="test" style="color:red;" plain>
               <a href="#" mod="menu-pad">Item Level CSS</a>
            </MenuItem>
         </Menu>
      </MenuItem>
      <MenuItem>
         <span>Edit</span>
         <Menu putInto="dropdown">
            <MenuItem>
               <a href="#" mod="menu-pad">Link</a>
            </MenuItem>

            <hr/>

            <TextField value:bind="$page.text"  mod="menu"/>
            <Checkbox value:bind="$page.checked" mod="menu">Checkbox</Checkbox>
            <MenuItem>
               <span>Submenu 1</span>
               <Menu putInto="dropdown">
                  <MenuItem>
                     <a href="#">Item 1</a>
                  </MenuItem>
                  <MenuItem>
                     <a href="#">Item 2</a>
                  </MenuItem>
               </Menu>
            </MenuItem>
            <MenuItem>
               <span>Submenu 2</span>
               <Menu putInto="dropdown">
                  <MenuItem>
                     <a href="#">Item 1</a>
                  </MenuItem>
                  <MenuItem>
                     <a href="#">Item 2</a>
                  </MenuItem>
               </Menu>
            </MenuItem>
         </Menu>
      </MenuItem>
      <Button mod="hollow">Hollow</Button>
      <Button mod="menu">Button</Button>
      <TextField value:bind="$page.text" />
   </Menu>
</cx>;