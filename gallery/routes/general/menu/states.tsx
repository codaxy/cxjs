import {cx, Section, FlexRow, Menu, Submenu, TextField, Checkbox, DateField, MenuItem} from 'cx/widgets';
import {bind, expr} from 'cx/ui';

export default <cx>
    <FlexRow wrap spacing="large" target="desktop">
        <Section mod="well" title="Horizontal" hLevel={4}>
            <Menu horizontal>
            <Submenu>
                File
                <Menu putInto="dropdown">
                    <a href="#">Link</a>
                    <hr/>
                    <TextField value={bind("text" )} mod="menu"/>
                    <Checkbox value={bind("checked")} mod="menu">Checkbox</Checkbox>
                    <Submenu arrow>
                        Submenu 1
                        <Menu putInto="dropdown">
                            <a href="#">Sub-Item 1</a>
                            <a href="#">Sub-Item 2</a>
                        </Menu>
                    </Submenu>
                    <Submenu arrow>
                        Submenu 2
                        <Menu putInto="dropdown">
                            <a href="#">Item 1</a>
                            <a href="#">Item 2</a>
                        </Menu>
                    </Submenu>
                    <DateField value={bind("date")} mod="menu"  />
                    <MenuItem class="test" style="color:red;" autoClose>
                        <a href="#">Item Level CSS</a>
                    </MenuItem>
                </Menu>
            </Submenu>
            <Submenu>
                Edit
                <Menu putInto="dropdown">
                    <a href="#">Item 1</a>
                    <a href="#">Item 2</a>
                    <a href="#">Item 3</a>
                    <a href="#">Item 4</a>
                    <a href="#">Item 5</a>
                </Menu>
            </Submenu>
                <Submenu>
                    View
                    <Menu putInto="dropdown">
                        <a href="#">Item 1</a>
                        <a href="#">Item 2</a>
                        <a href="#">Item 3</a>
                        <a href="#">Item 4</a>
                        <a href="#">Item 5</a>
                    </Menu>
                </Submenu>
        </Menu>
        </Section>

        <Section mod="well" title="Dropdown" hLevel={4}>
            <Menu horizontal>
                <Submenu arrow>
                    Menu
                    <Menu putInto="dropdown">
                        <a href="#">Item 1</a>
                        <a href="#">Item 2</a>
                        <a href="#">Item 3</a>
                        <a href="#">Item 4</a>
                        <a href="#">Item 5</a>
                        <Submenu arrow>
                            Submenu
                            <Menu putInto="dropdown">
                                <a href="#">Sub-Item 1</a>
                                <a href="#">Sub-Item 2</a>
                            </Menu>
                        </Submenu>
                    </Menu>
                </Submenu>
            </Menu>
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
declare let module: any;
hmr(module);