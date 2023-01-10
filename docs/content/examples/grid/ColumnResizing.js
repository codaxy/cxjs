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

let MyResizableGrid = <cx>
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
    />
</cx>;

export const ColumnResizing = <cx>
    <Md controller={PageController}>
        <CodeSplit>
            # Column Resizing

            Grid supports column resizing. To enable resizing on a column set the `resizable` flag to `true`.
            If column widths need to be persisted, add the `width` binding or use `onColumnResize` event to process new measures.
            Use `defaultWidth` to set the initial width. These properties should be defined in the `header` object,
            but they can also be set on the column itself if there is only one header.

            <MyResizableGrid/>

            Resize columns on the top and observe how changes are applied to the grid below too.
            Double clicking on a resizer will calculate minimum width required to fit the content of the column.

            <MyResizableGrid/>

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
                    />
                `}
                </CodeSnippet>
            </Content>
        </CodeSplit>

    </Md>
</cx>;
