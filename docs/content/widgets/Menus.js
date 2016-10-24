import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';
import {Menu, MenuItem} from 'cx/ui/nav/Menu';
import {Submenu} from 'cx/ui/nav/Submenu';
import {TextField} from 'cx/ui/form/TextField';
import {DateField} from 'cx/ui/form/DateField';
import {Checkbox} from 'cx/ui/form/Checkbox';

import configs from './configs/Menu';

export const Menus = <cx>
    <Md>
        # Menu

        <CodeSplit>

            The `Menu` widget is used to present a list of options or commands in a horizontal or a vertical form.
            The `Submenu` widget is used when multiple options need to be shown under a single menu item.

            Menus are completely driven by focus. If the menu loses focus, all sub-menus are closed.

            > `menu` and `menu-pad` modifiers are used to add margin/padding to menu items. Use `menu` on elements with
            well defined boundaries (input fields) to add margins. Use `menu-pad` to pad links to take all available
            space within the containing menu item.


            <div class="widgets">
                <Menu horizontal>
                    <Submenu>
                        File
                        <Menu putInto="dropdown">
                            <a href="#" mod="menu-pad" onClick={e=> {
                                e.preventDefault();
                                document.activeElement.blur();
                            }}>Link</a>
                            <hr/>
                            <TextField value:bind="$page.text" mod="menu"/>
                            <TextField value:bind="$page.text" mod="menu"/>
                            <Checkbox value:bind="$page.checked" mod="menu">Checkbox</Checkbox>
                            <Submenu>
                                Submenu 1
                                <Menu putInto="dropdown">
                                    <a href="#" class="cxm-menu">Item 1</a>
                                    <a href="#" class="cxm-menu">Item 2</a>
                                </Menu>
                            </Submenu>
                            <Submenu>
                                Submenu 2
                                <Menu putInto="dropdown">
                                    <a href="#" mod="menu-pad">Item 1</a>
                                    <a href="#" mod="menu-pad">Item 2</a>
                                </Menu>
                            </Submenu>
                            <DateField value:bind="$page.date" mod="menu"/>
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
                         <a href="#" mod="menu-pad" onClick={e=>{ e.preventDefault(); document.activeElement.blur(); }}>Link</a>
                         <hr/>
                         <TextField value:bind="$page.text" mod="menu" />
                         <TextField value:bind="$page.text" mod="menu" />
                         <Checkbox value:bind="$page.checked" mod="menu">Checkbox</Checkbox>
                         <Submenu>
                            Submenu 1
                            <Menu putInto="dropdown">
                               <a href="#" class="cxm-menu">Item 1</a>
                               <a href="#" class="cxm-menu">Item 2</a>
                            </Menu>
                         </Submenu>
                         <Submenu>
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
            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>
