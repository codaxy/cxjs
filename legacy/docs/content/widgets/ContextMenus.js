import {HtmlElement, openContextMenu, Menu, Submenu, Grid, Tab, Content} from 'cx/widgets';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {MethodTable} from '../../components/MethodTable';
import {ImportPath} from '../../components/ImportPath';


import configs from './configs/HScroller';


export const ContextMenus = <cx>
    <Md>
        <CodeSplit>
            # ContextMenu

            <ImportPath path="import {ContextMenu, openContextMenu} from 'cx/widgets';"/>

            The `ContextMenu` widget is used for displaying menus on right-click events. The `openContextMenu` method
            wraps the logic of positioning and opening the menu into a single call.

            <div class="widgets">
                <a
                    href="#"
                    onContextMenu={(e, {store}) => openContextMenu(e, <cx>
                        <Menu>
                            <a href="#">Action 1</a>
                            <a href="#">Action 2</a>
                            <Submenu arrow>
                                Submenu
                                <Menu putInto="dropdown">
                                    <a href="#">Sub-Action 1</a>
                                    <a href="#">Sub-Action 2</a>
                                </Menu>
                            </Submenu>
                        </Menu>
                    </cx>, store)}
                >
                    Right-click me
                </a>
            </div>

            The `openContextMenu` method takes 3 arguments:

            * `event`: A context-menu event passed to the handler. Required.
            * `contents`: Cx widget configuration. Usually a menu. Required.
            * `store`: A store to be used inside the menu. Optional.
            
            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default/>
                <Tab value-bind="$page.code.tab" mod="code" tab="grid" text="Grid"/>

                <CodeSnippet visible-expr="{$page.code.tab}=='index'"  fiddle="ZLepRQdp">{`
                    <a
                        href="#"
                        onContextMenu={(e, {store}) => openContextMenu(e, <cx>
                            <Menu>
                                <a href="#">Action 1</a>
                                <a href="#">Action 2</a>
                                <Submenu arrow>
                                    Submenu
                                    <Menu putInto="dropdown">
                                        <a href="#">Sub-Action 1</a>
                                        <a href="#">Sub-Action 2</a>
                                    </Menu>
                                </Submenu>
                            </Menu>
                        </cx>, store)}
                    >
                        Right-click me
                    </a>
                `}
                </CodeSnippet>

                <CodeSnippet visible-expr="{$page.code.tab}=='grid'" fiddle="v78Gj7fZ">{`
                    <Grid
                        records={[
                            { name: 'Row 1', visits: 10 },
                            { name: 'Row 2', visits: 20 },
                            { name: 'Row 3', visits: 30 },
                            { name: 'Row 4', visits: 40 },
                            { name: 'Row 5', visits: 50 },
                        ]}
                        columns={[
                            {header: 'Name', field: 'name' },
                            {header: 'Visits', field: 'visits', align: 'right'}
                        ]}
                        onRowContextMenu={(e, {store}) => openContextMenu(e, <cx>
                            <Menu>
                                <a href="#">Row Action 1</a>
                                <a href="#">Row Action 2</a>
                                <a href="#">Row Action 3</a>
                            </Menu>
                        </cx>, store)}
                        onColumnContextMenu={(e, {store}) => openContextMenu(e, <cx>
                            <Menu>
                                <a href="#">Column Action 1</a>
                                <a href="#">Column Action 2</a>
                                <a href="#">Column Action 3</a>
                            </Menu>
                        </cx>, store)}
                    />

                `}
                </CodeSnippet>
            </Content>
        </CodeSplit>

        <CodeSplit>

            ### Context-menus in Grids

            Context menus are commonly used with grids (data-tables) to display additional actions for grid records.

            <Grid
                records={[
                    { name: 'Row 1', visits: 10 },
                    { name: 'Row 2', visits: 20 },
                    { name: 'Row 3', visits: 30 },
                    { name: 'Row 4', visits: 40 },
                    { name: 'Row 5', visits: 50 },
                ]}
                columns={[
                    {header: 'Name', field: 'name' },
                    {header: 'Visits', field: 'visits', align: 'right'}
                ]}
                onRowContextMenu={(e, {store}) => openContextMenu(e, <cx>
                    <Menu>
                        <a href="#">Row Action 1</a>
                        <a href="#">Row Action 2</a>
                        <a href="#">Row Action 3</a>
                    </Menu>
                </cx>, store)}
                onColumnContextMenu={(e, {store}) => openContextMenu(e, <cx>
                    <Menu>
                        <a href="#">Column Action 1</a>
                        <a href="#">Column Action 2</a>
                        <a href="#">Column Action 3</a>
                    </Menu>
                </cx>, store)}
            />
        </CodeSplit>
    </Md>
</cx>
