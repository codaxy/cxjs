import {Grid, HtmlElement, Button, TextField, NumberField, Content, Tab} from "cx/widgets";
import {Controller, bind} from "cx/ui";
import {casual} from '../data/casual';
import {Md} from '../../../components/Md';
import {CodeSplit} from '../../../components/CodeSplit';
import {CodeSnippet} from '../../../components/CodeSnippet';

class PageController extends Controller {
    onInit() {
        //init grid data
        if (!this.store.get('$page.records'))
            this.shuffle();
    }

    shuffle() {
        this.store.set(
            "$page.records",
            Array
                .from({length: 10})
                .map((v, i) => ({
                    fullName: casual.full_name,
                    continent: casual.continent,
                    browser: casual.browser,
                    os: casual.operating_system,
                    visits: casual.integer(1, 100)
                }))
        );
    }
}

export const ColumnResizing = <cx>
    <Md controller={PageController}>
        <CodeSplit>
            # Column Resizing

            Grid supports column resizing.

            <Grid
                records-bind="$page.records"
                columns={[
                    {
                        header: {
                            text: "Name",
                            width: bind('$page.colWidth.fullName'),
                            resizable: true,
                            defaultWidth: 200
                        },
                        field: "fullName",
                        sortable: true
                    },
                    {
                        header: "Continent",
                        width: bind('$page.colWidth.continent'),
                        resizable: true,
                        field: "continent",
                        sortable: true
                    },
                    {
                        header: "Browser",
                        width: bind('$page.colWidth.browser'),
                        resizable: true,
                        field: "browser",
                        sortable: true
                    },
                    {
                        header: "OS",
                        width: bind('$page.colWidth.os'),
                        resizable: true,
                        field: "os",
                        sortable: true
                    },
                    {
                        header: "Visits",
                        width: bind('$page.colWidth.visits'),
                        resizable: false,
                        field: "visits",
                        sortable: true,
                        align: "right"
                    }
                ]}
                scrollable
                style="max-height: 400px; margin-bottom: 10px"
                onRef={(el, instance) => {
                    instance.controller.gridInstance = instance;
                }}
            />

            <Button
                text="Reset column widths"
                onClick={(e, { store, controller }) => {
                    controller.gridInstance.setState({ colWidth: {} });
                    store.delete('$page.colWidth');
                }}
            />

            To enable resizing on a column, set the `resizable` flag to `true`.

            If columns widths need to be persisted, add the `width` binding or use grid's `onColumnResize` event to process new measures.
            Use `defaultWidth` to set the initial width. These properties should be defined in the `header` object,
            but they can also be set on the column itself if there is only one header.

            Double clicking on a resizer will calculate minimum width required to fit the content of the column.

            Default column widths can be restored by clearing both column widths store and grid instance `colWidth` state.
            You can reset the default column widths by clearing both the column widths store and the Grid instance's `colWidth` state.
            To clear the `colWidth` state, maintain the grid instance using the `onRef` callback and apply the `setState` method.

            <Content name="code">
                <Tab  value-bind="$page.code.tab" tab="controller" mod="code" text='Controller' />
                <Tab  value-bind="$page.code.tab" tab="grid" mod="code" text='Grid' default/>
                <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="DaBDyiCf">{`
                class PageController extends Controller {
                    onInit() {
                        //init grid data
                        if (!this.store.get('$page.records'))
                            this.shuffle();
                    }

                    shuffle() {
                        this.store.set(
                            "$page.records",
                            Array
                                .from({length: 10})
                                .map((v, i) => ({
                                    fullName: casual.full_name,
                                    continent: casual.continent,
                                    browser: casual.browser,
                                    os: casual.operating_system,
                                    visits: casual.integer(1, 100)
                                }))
                        );
                    }
                }
                `}</CodeSnippet>
                <CodeSnippet visible-expr="{$page.code.tab}=='grid'" fiddle="DaBDyiCf">{`
                    <Grid
                        records-bind="$page.records"
                        columns={[
                            {
                                header: {
                                    text: "Name",
                                    width: bind('$page.colWidth.fullName'),
                                    resizable: true,
                                    defaultWidth: 200
                                },
                                field: "fullName",
                                sortable: true
                            },
                            {
                                header: "Continent",
                                width: bind('$page.colWidth.continent'),
                                resizable: true,
                                field: "continent",
                                sortable: true
                            },
                            {
                                header: "Browser",
                                width: bind('$page.colWidth.browser'),
                                resizable: true,
                                field: "browser",
                                sortable: true
                            },
                            {
                                header: "OS",
                                width: bind('$page.colWidth.os'),
                                resizable: true,
                                field: "os",
                                sortable: true
                            },
                            {
                                header: "Visits",
                                width: bind('$page.colWidth.visits'),
                                resizable: false,
                                field: "visits",
                                sortable: true,
                                align: "right"
                            }
                        ]}
                        scrollable
                        style="max-height: 400px; margin-bottom: 10px"
                        onRef={(el, instance) => {
                            instance.controller.gridInstance = instance;
                        }}
                    />

                    <Button
                        text="Reset column widths"
                        onClick={(e, {store, controller}) => {
                            controller.gridInstance.setState({ colWidth: {} });
                            store.delete('$page.colWidth');
                        }}
                    />
                `}
                </CodeSnippet>
            </Content>
        </CodeSplit>

    </Md>
</cx>;
