import { HtmlElement, Menu, MenuItem, MenuSpacer, Submenu, TextField, DateField, Checkbox, Tab } from 'cx/widgets';
import { Content, computable } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';
import {KeyCode} from "cx/util";


import configs from './configs/Menu';
import menuItemConfigs from './configs/MenuItem'

export const Menus = <cx>
    <Md>
        <CodeSplit>

            # Menu

            <ImportPath path="import { Menu, Submenu, MenuItem, MenuSpacer } from 'cx/widgets';" />

            The `Menu` widget is used to present a list of options or commands in a horizontal or a vertical form.
            The `Submenu` widget is used when multiple options need to be shown under a single menu item.

            Menus are completely driven by focus. If the menu loses focus, all sub-menus are closed.

            <div class="widgets">
                <Menu horizontal overflow style="width: 300px">
                    <Submenu keyboardShortcut={KeyCode.esc}>
                        File
                        <Menu putInto="dropdown" icons>
                            <MenuItem
                                autoClose
                                text="Action"
                                onClick={() => { alert('Action')}}
                            />
                            <MenuItem icon="search" autoClose>
                                <a href="#">Link</a>
                            </MenuItem>
                            <MenuItem icon="search" disabled onClick={() => { alert('Disabled')}}>
                                Disabled
                            </MenuItem>
                            <MenuItem checked={{bind: '$page.checked', defaultValue: true}}>
                                Checkbox
                            </MenuItem>
                            <hr/>
                            <MenuItem hideCursor>
                                <TextField value:bind="$page.text" mod="menu"/>
                            </MenuItem>
                            <Submenu arrow icon="calendar" placement="top">
                                Submenu
                                <Menu putInto="dropdown">
                                    <a href="#">Item 1</a>
                                    <a href="#">Item 2</a>
                                </Menu>
                            </Submenu>
                            <Submenu checked={{bind: '$page.checked', defaultValue: true}} arrow>
                                Submenu + Check
                                <Menu putInto="dropdown">
                                    <a href="#">Item 1</a>
                                    <a href="#">Item 2</a>
                                </Menu>
                            </Submenu>
                        </Menu>
                    </Submenu>
                    <Submenu>
                        Edit
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
                                Submenu
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
                    <MenuSpacer />
                    <Submenu keyboardShortcut={KeyCode.esc}>
                        Right
                        <Menu putInto="dropdown" icons>
                            <MenuItem
                                autoClose
                                text="Action"
                                onClick={() => { alert('Action')}}
                            />
                            <MenuItem icon="search" autoClose>
                                <a href="#">Link</a>
                            </MenuItem>
                            <MenuItem icon="search" disabled onClick={() => { alert('Disabled')}}>
                                Disabled
                            </MenuItem>
                            <MenuItem checked={{bind: '$page.checked', defaultValue: true}}>
                                Checkbox
                            </MenuItem>
                            <hr/>
                            <MenuItem hideCursor>
                                <TextField value:bind="$page.text" mod="menu"/>
                            </MenuItem>
                            <Submenu arrow icon="calendar" placement="top">
                                Submenu
                                <Menu putInto="dropdown">
                                    <a href="#">Item 1</a>
                                    <a href="#">Item 2</a>
                                </Menu>
                            </Submenu>
                            <Submenu checked={{bind: '$page.checked', defaultValue: true}} arrow>
                                Submenu + Check
                                <Menu putInto="dropdown">
                                    <a href="#">Item 1</a>
                                    <a href="#">Item 2</a>
                                </Menu>
                            </Submenu>
                        </Menu>
                    </Submenu>
                </Menu>
            </div>

            <Content name="code">
                <CodeSnippet fiddle="LZFHw09A">{`
                <Menu horizontal overflow style="width: 300px">
                    <Submenu keyboardShortcut={KeyCode.esc}>
                        File
                        <Menu putInto="dropdown" icons>
                            <MenuItem
                                autoClose
                                text="Action"
                                onClick={() => { alert('Action')}}
                            />
                            <MenuItem icon="search" autoClose>
                                <a href="#">Link</a>
                            </MenuItem>
                            <MenuItem icon="search" disabled onClick={() => { alert('Disabled')}}>
                                Disabled
                            </MenuItem>
                            <MenuItem checked={{bind: '$page.checked', defaultValue: true}}>
                                Checkbox
                            </MenuItem>
                            <hr/>
                            <MenuItem hideCursor>
                                <TextField value:bind="$page.text" mod="menu"/>
                            </MenuItem>
                            <Submenu arrow icon="calendar">
                                Submenu
                                <Menu putInto="dropdown">
                                    <a href="#">Item 1</a>
                                    <a href="#">Item 2</a>
                                </Menu>
                            </Submenu>
                            <Submenu checked={{bind: '$page.checked', defaultValue: true}} arrow>
                                Submenu + Check
                                <Menu putInto="dropdown">
                                    <a href="#">Item 1</a>
                                    <a href="#">Item 2</a>
                                </Menu>
                            </Submenu>
                        </Menu>
                    </Submenu>
                    <Submenu>
                        Edit
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
                            <MenuSpacer />
                            <MenuItem text="Right" onClick={() => {}} />
                        </Menu>
                    </Submenu>
                </Menu>
            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        Horizontal menus are made smaller to match toolbar items, unless `size` is explicitly set.
        The `menu` modifier is used to add margin/padding to menu items.

        Use `MenuSpacer` to push some items to the right. Use `overflow` to display an overflow menu which will hold
        items which cannot fit the designated menu area.

        ## Configuration
        <p>
            <Tab value={{ bind: "$page.configTab", defaultValue: 'menu' }} tab="menu" mod="line">Menu</Tab>
            <Tab value:bind="$page.configTab" tab="menuitem" mod="line">Menu Item</Tab>
        </p>

        <ConfigTable props={configs} visible-expr="{$page.configTab}=='menu'"/>
        <ConfigTable props={menuItemConfigs} visible-expr="{$page.configTab}=='menuitem'"/>

    </Md>
</cx>
