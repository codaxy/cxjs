import {DateField} from 'cx/ui/form/DateField';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {TextField} from 'cx/ui/form/TextField';
import {Submenu} from 'cx/ui/nav/Submenu';
import {Menu, MenuItem} from 'cx/ui/nav/Menu';
import {HtmlElement} from 'cx/ui/HtmlElement';

export default <cx>
   <Menu horizontal>
      <Submenu>
         File
         <Menu putInto="dropdown">
            <a href="#" mod="menu-pad" onClick={e=>{ e.preventDefault(); document.activeElement.blur(); }}>Link</a>
            <hr/>
            <TextField value:bind="$page.text" mod="menu" />
            <TextField value:bind="$page.text" mod="menu" />
            <Checkbox value:bind="$page.checked" mod="menu">Checkbox</Checkbox>
            <Submenu arrow>
               Submenu 1
               <Menu putInto="dropdown">
                  <a href="#" class="cxm-menu">Item 1</a>
                  <a href="#" class="cxm-menu">Item 2</a>
               </Menu>
            </Submenu>
            <Submenu arrow>
               Submenu 2
               <Menu putInto="dropdown">
                  <a href="#" mod="menu-pad">Item 1</a>
                  <a href="#" mod="menu-pad">Item 2</a>
               </Menu>
            </Submenu>
            <DateField value:bind="$page.date" mod="menu" />
            <MenuItem mod="active" class="test" style="color:red;">
               <a href="#" mod="menu-pad">Item Level CSS</a>
            </MenuItem>
         </Menu>
      </Submenu>
      <Submenu>
         Edit
         <Menu putInto="dropdown">
            <a href="#" mod="menu-pad">Link</a>
            <hr/>
            <TextField value:bind="$page.text"  mod="menu"/>
            <Checkbox value:bind="$page.checked" mod="menu">Checkbox</Checkbox>
            <Submenu>
               Submenu 1
               <Menu putInto="dropdown">
                  <a href="#"class="cxm-menu-pad">Item 1</a>
                  <a href="#"class="cxm-menu-pad">Item 2</a>
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
</cx>;