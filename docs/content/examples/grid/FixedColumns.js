import { HtmlElement, Checkbox, Grid, TextField, Content, Tab } from "cx/widgets";
import { Controller, KeySelection } from "cx/ui";
import { Md } from "../../../components/Md";
import { CodeSplit } from "../../../components/CodeSplit";
import { CodeSnippet } from "../../../components/CodeSnippet";

import { casual } from "../data/casual";

class PageController extends Controller {
    onInit() {
        this.store.init(
            "$page.records",
            Array.from({ length: 5000 }).map((v, i) => ({
                id: i + 1,
                fullName: casual.full_name,
                continent: casual.continent,
                browser: casual.browser,
                os: casual.operating_system,
                visits: casual.integer(1, 100)
            }))
        );
    }
}

export const FixedColumns = (
    <cx>
        <Md controller={PageController}>
            # Fixed Columns
            <CodeSplit>
                The `Grid` widget supports fixing columns to the left hand side
                for grids which have many columns. Simply, set `fixed: true` on
                the column and it will appear on the left. 
                > The grid with fixed
                columns does not support grouping.
                <Grid
                    records-bind="$page.records"
                    scrollable
                    buffered
                    style="height: 600px;"
                    lockColumnWidths
                    fixedFooter
                    cached
                    mod="fixed-layout"
                    cellEditable
                    columns={[
                        {
                            header: "#",
                            field: "index",
                            sortable: true,
                            value: { bind: "$index" },
                            fixed: true,
                            resizable: true,
                            aggregate: "count"
                        },
                        {
                            header: {
                                text: "Name"
                            },
                            field: "fullName",
                            sortable: true,
                            fixed: true,
                            resizable: true,
                            defaultWidth: 200,
                            editor: (
                                <cx>
                                    <TextField
                                        value-bind="$record.fullName"
                                        style="width: 100%"
                                        autoFocus
                                        required
                                        visited
                                    />
                                </cx>
                            )
                        },
                        {
                            header: "Continent",
                            field: "continent",
                            sortable: true,
                            resizable: true,
                            aggregate: "count",
                            editor: (
                                <cx>
                                    <TextField
                                        value-bind="$record.continent"
                                        style="width: 100%"
                                        autoFocus
                                    />
                                </cx>
                            )
                        },
                        {
                            header: "Browser",
                            field: "browser",
                            sortable: true,
                            resizable: true
                        },
                        {
                            header: "Browser",
                            field: "browser",
                            sortable: true,
                            resizable: true
                        },
                        {
                            header: "Browser",
                            field: "browser",
                            sortable: true,
                            resizable: true
                        },
                        {
                            header: "Browser",
                            field: "browser",
                            sortable: true,
                            resizable: true
                        },
                        {
                            header: "Browser",
                            field: "browser",
                            sortable: true,
                            resizable: true
                        },
                        {
                            header: "Browser",
                            field: "browser",
                            sortable: true,
                            resizable: true
                        },
                        {
                            header: "Browser",
                            field: "browser",
                            sortable: true,
                            resizable: true
                        },
                        {
                            header: "Browser",
                            field: "browser",
                            sortable: true,
                            resizable: true
                        },
                        {
                            header: "OS",
                            field: "os",
                            sortable: true,
                            resizable: true
                        },
                        {
                            header: "Visits",
                            field: "visits",
                            sortable: true,
                            align: "right",
                            resizable: true
                        }
                    ]}
                />
                <Content name="code">
                    <Tab value-bind="$page.code.tab" tab="controller" mod="code" text="Controller" />
                    <Tab value-bind="$page.code.tab" tab="grid" mod="code" text="Grid" default/>
                    <Tab value-bind="$page.code.tab" tab="columns" mod="code" text="Columns" />
                    <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="wISoYrYi">{`
                    class PageController extends Controller {
                        onInit() {
                            this.store.init(
                                "$page.records",
                                Array
                                    .from({length: 5000})
                                    .map((v, i) => ({
                                        id: i + 1,
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
                    <CodeSnippet visible-expr="{$page.code.tab}=='grid'" fiddle="wISoYrYi">{`
                    <Grid
                        records-bind="$page.records"
                        scrollable
                        buffered
                        style="height: 600px;"
                        lockColumnWidths
                        fixedFooter
                        cached
                        mod="fixed-layout"
                        cellEditable
                        columns={allColumns}
                    />
                    `}</CodeSnippet>
                    <CodeSnippet visible-expr="{$page.code.tab}=='columns'" fiddle="wISoYrYi">{`
                    let AllColumns = [
                        {
                            header: "#",
                            field: "index",
                            sortable: true,
                            value: { bind: "$index" },
                            fixed: true,
                            resizable: true,
                            aggregate: "count"
                        },
                        {
                            header: {
                                text: "Name"
                            },
                            field: "fullName",
                            sortable: true,
                            fixed: true,
                            resizable: true,
                            defaultWidth: 200,
                            editor: (
                                <cx>
                                    <TextField
                                        value-bind="$record.fullName"
                                        style="width: 100%"
                                        autoFocus
                                        required
                                        visited
                                    />
                                </cx>
                            )
                        },
                        {
                            header: "Continent",
                            field: "continent",
                            sortable: true,
                            resizable: true,
                            aggregate: "count",
                            editor: (
                                <cx>
                                    <TextField
                                        value-bind="$record.continent"
                                        style="width: 100%"
                                        autoFocus
                                    />
                                </cx>
                            )
                        },
                        {
                            header: "Browser",
                            field: "browser",
                            sortable: true,
                            resizable: true
                        },
                        {
                            header: "Browser",
                            field: "browser",
                            sortable: true,
                            resizable: true
                        },
                        {
                            header: "Browser",
                            field: "browser",
                            sortable: true,
                            resizable: true
                        },
                        {
                            header: "Browser",
                            field: "browser",
                            sortable: true,
                            resizable: true
                        },
                        {
                            header: "Browser",
                            field: "browser",
                            sortable: true,
                            resizable: true
                        },
                        {
                            header: "Browser",
                            field: "browser",
                            sortable: true,
                            resizable: true
                        },
                        {
                            header: "Browser",
                            field: "browser",
                            sortable: true,
                            resizable: true
                        },
                        {
                            header: "Browser",
                            field: "browser",
                            sortable: true,
                            resizable: true
                        },
                        {
                            header: "OS",
                            field: "os",
                            sortable: true,
                            resizable: true
                        },
                        {
                            header: "Visits",
                            field: "visits",
                            sortable: true,
                            align: "right",
                            resizable: true
                        }
                    ];

                    `}
                    </CodeSnippet>
                </Content>
            </CodeSplit>
        </Md>
    </cx>
);
