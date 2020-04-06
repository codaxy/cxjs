import { HtmlElement, Checkbox, Grid, TextField } from "cx/widgets";
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
                the column and it will appear on the left. > The grid with fixed
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
                <CodeSnippet putInto="code">{`
                class PageController extends Controller {
                    onInit() {
                        this.store.init(
                            "$page.records",
                            Array
                                .from({length: 10000})
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
                ...
                <Grid
                    records:bind="$page.records"
                    keyField="id"
                    buffered
                    style="height: 800px"
                    mod="fixed-layout"
                    cached
                    columns={[
                        { header: '#', field: "index", sortable: true, value: { expr: "{$index}+1"} },
                        { header: { text: "Name", style: 'width: 100%' }, field: "fullName", sortable: true, resizable: true },
                        { header: "Continent", field: "continent", sortable: true, resizable: true, defaultWidth: 150 },
                        { header: "Browser", field: "browser", sortable: true, resizable: true, defaultWidth: 170 },
                        { header: "OS", field: "os", sortable: true, resizable: true, defaultWidth: 100 },
                        { header: "Visits", field: "visits", sortable: true, align: "right", resizable: true, defaultWidth: 70 }
                    ]}
                    selection={{ type: KeySelection, bind: "$page.selection" }}
                />
                `}</CodeSnippet>
            </CodeSplit>
        </Md>
    </cx>
);
