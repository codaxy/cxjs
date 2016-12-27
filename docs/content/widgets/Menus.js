import { HtmlElement, Menu, MenuItem, Submenu, TextField, DateField, Checkbox } from 'cx/widgets';
import { Content } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';


import configs from './configs/Menu';

export const Menus = <cx>
    <Md>
        # Menu

        <ImportPath path="import { Menu, Submenu, MenuItem } from 'cx/widgets';" />

        <CodeSplit>

            The `Menu` widget is used to present a list of options or commands in a horizontal or a vertical form.
            The `Submenu` widget is used when multiple options need to be shown under a single menu item.

            Menus are completely driven by focus. If the menu loses focus, all sub-menus are closed.

            <div class="widgets">
                <Menu horizontal>
                    <Submenu>
                        File
                        <Menu putInto="dropdown">
                            <a href="#" onClick={e=> {
                                e.preventDefault();
                                document.activeElement.blur();
                            }}>Link</a>
                            <hr/>
                            <TextField value:bind="$page.text" mod="menu"/>
                            <TextField value:bind="$page.text" mod="menu"/>
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
                                    <a href="#">Item 1</a>
                                    <a href="#">Item 2</a>
                                </Menu>
                            </Submenu>
                            <DateField value:bind="$page.date" mod="menu"/>
                            <MenuItem mod="active" class="test" style="color:red;">
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
                            <Submenu>
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

            <Content name="code">
                <CodeSnippet>{`
               <Menu horizontal>
                   <Submenu>
                      File
                      <Menu putInto="dropdown">
                         <a href="#" onClick={e=>{ e.preventDefault(); document.activeElement.blur(); }}>Link</a>
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
                               <a href="#">Item 1</a>
                               <a href="#">Item 2</a>
                            </Menu>
                         </Submenu>
                         <DateField value:bind="$page.date" mod="menu" />
                         <MenuItem mod="active" class="test" style="color:red;">
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
            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        Horizontal menus are made smaller to match toolbar items, unless `size` is explicitly set. 
        The `menu` modifier is used to add margin/padding to menu items.

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>
