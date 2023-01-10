import {Grid, HtmlElement, Button, TextField, NumberField, Content, Tab} from "cx/widgets";
import {Controller} from "cx/ui";
import {Svg} from "cx/svg";
import {Chart, Gridlines, LineGraph, NumericAxis} from "cx/charts";
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
                .from({length: 20})
                .map((v, i) => ({
                    fullName: casual.full_name,
                    continent: casual.continent,
                    browser: casual.browser,
                    os: casual.operating_system,
                    visits: casual.integer(1, 100),
                    points: this.generateTrend()
                }))
        );
    }

    generateTrend() {
        let y = 100;
        return Array.from({length: 101}, (_, i) => ({
            x: i * 4,
            y: y = y + Math.random() - 0.5
        }))
    }
}

export const RowExpanding = <cx>
    <Md controller={PageController}>
        <CodeSplit>
            # Grid with Row Expanding

            Grid supports rendering rows in multiple lines. Lines can be shown or hidden which is convenient
            for implementing drill-downs and on demand content.
            Click on the search icon to expand the grid header with search controls.
            Click on the arrows to expand individual rows.
            Please note that search is not implemented in this example.

            <Grid
                records-bind="$page.records"
                lockColumnWidths
                cached
                row={{
                    style: {
                        background: {expr: "{$record.showDescription} ? '#fff7e6' : null"}
                    },
                    line1: {
                        columns: [
                            {
                                header: "Name",
                                field: "fullName",
                                sortable: true
                            },
                            {
                                header: "Continent",
                                field: "continent",
                                sortable: true
                            },
                            {
                                header: "Browser",
                                field: "browser",
                                sortable: true
                            },
                            {
                                header: "OS",
                                field: "os",
                                sortable: true
                            },
                            {
                                header: "Visits",
                                field: "visits",
                                sortable: true,
                                align: "right"
                            }, {
                                header: {
                                    items: <cx>
                                        <cx>
                                            <Button
                                                mod="hollow"
                                                icon="search"
                                                onClick={(e, {store}) => {
                                                    store.toggle('$page.showGridFilter');
                                                }}
                                            />
                                        </cx>
                                    </cx>
                                },
                                align: "center",
                                items: <cx>
                                    <cx>
                                        <Button
                                            mod="hollow"
                                            icon="drop-down"
                                            onClick={(e, {store}) => {
                                                store.toggle('$record.showDescription');
                                            }}
                                        />
                                    </cx>
                                </cx>
                            }
                        ]
                    },
                    line2: {
                        showHeader: { expr: '!!{$page.showGridFilter}' },
                        visible: false,
                        columns: [
                            {
                                header: {
                                    items: <cx>
                                        <TextField
                                            value-bind="$page.filter.fullName"
                                            style="width: 100%"
                                            autoFocus
                                        />
                                    </cx>
                                }
                            },
                            {
                                header: {
                                    items: <cx>
                                        <TextField
                                            value-bind="$page.filter.continent"
                                            style="width: 100%"
                                        />
                                    </cx>
                                }
                            },
                            {
                                header: {
                                    items: <cx>
                                        <TextField
                                            value-bind="$page.filter.browser"
                                            style="width: 100%"
                                        />
                                    </cx>
                                }
                            },
                            {
                                header: {
                                    items: <cx>
                                        <TextField
                                            value-bind="$page.filter.os"
                                            style="width: 100%"
                                        />
                                    </cx>
                                }
                            },
                            {
                                header: {
                                    items: <cx>
                                        <NumberField
                                            value-bind="$page.filter.visits"
                                            style="width: 100%"
                                            inputStyle="text-align: right"
                                        />
                                    </cx>
                                }
                            }, {
                                header: {
                                    align: 'center',
                                    items: <cx>
                                        <cx>
                                            <Button
                                                mod="hollow"
                                                icon="close"
                                                onClick={(e, {store}) => {
                                                    store.toggle('$page.showGridFilter');
                                                }}
                                            />
                                        </cx>
                                    </cx>
                                }
                            }
                        ]
                    },
                    line3: {
                        visible: {expr: "{$record.showDescription}"},
                        columns: [{
                            colSpan: 1000,
                            style: 'border-top-color: rgba(0, 0, 0, 0.05)',
                            items: <cx>
                                <Svg style="width:100%px; height:400px;">
                                    <Chart offset="20 -10 -40 40"
                                           axes={{x: {type: NumericAxis}, y: {type: NumericAxis, vertical: true}}}>
                                        <Gridlines/>
                                        <LineGraph data-bind="$record.points" colorIndex={8}/>
                                    </Chart>
                                </Svg>
                            </cx>
                        }]
                    }
                }}
            />

            <Content name="code">
                <div>
                    <Tab value-bind="$page.code.tab" tab="controller" mod="code" text="Controller" />
                    <Tab value-bind="$page.code.tab" tab="grid" mod="code"  text="Grid" default/>
                </div>
                <CodeSnippet fiddle="puN3fVm4" visible-expr="{$page.code.tab}=='controller'">{`
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
                                    .from({length: 20})
                                    .map((v, i) => ({
                                        fullName: casual.full_name,
                                        continent: casual.continent,
                                        browser: casual.browser,
                                        os: casual.operating_system,
                                        visits: casual.integer(1, 100),
                                        points: this.generateTrend()
                                    }))
                            );
                        }

                        generateTrend() {
                            let y = 100;
                            return Array.from({length: 101}, (_, i) => ({
                                x: i * 4,
                                y: y = y + Math.random() - 0.5
                            }))
                        }
                    }`}</CodeSnippet>
                <CodeSnippet fiddle="puN3fVm4" visible-expr="{$page.code.tab}=='grid'">{`
                    <Grid
                        records-bind="$page.records"
                        lockColumnWidths
                        cached
                        row={{
                            style: {
                                background: {expr: "{$record.showDescription} ? '#fff7e6' : null"}
                            },
                            line1: {
                                columns: [
                                    {
                                        header: "Name",
                                        field: "fullName",
                                        sortable: true
                                    },
                                    {
                                        header: "Continent",
                                        field: "continent",
                                        sortable: true
                                    },
                                    {
                                        header: "Browser",
                                        field: "browser",
                                        sortable: true
                                    },
                                    {
                                        header: "OS",
                                        field: "os",
                                        sortable: true
                                    },
                                    {
                                        header: "Visits",
                                        field: "visits",
                                        sortable: true,
                                        align: "right"
                                    }, {
                                        header: {
                                            items: <cx>
                                                <cx>
                                                    <Button
                                                        mod="hollow"
                                                        icon="search"
                                                        onClick={(e, {store}) => {
                                                            store.toggle('$page.showGridFilter');
                                                        }}
                                                    />
                                                </cx>
                                            </cx>
                                        },
                                        align: "center",
                                        items: <cx>
                                            <cx>
                                                <Button
                                                    mod="hollow"
                                                    icon="drop-down"
                                                    onClick={(e, {store}) => {
                                                        store.toggle('$record.showDescription');
                                                    }}
                                                />
                                            </cx>
                                        </cx>
                                    }
                                ]
                            },
                            line2: {
                                showHeader: { expr: '!!{$page.showGridFilter}' },
                                visible: false,
                                columns: [
                                    {
                                        header: {
                                            items: <cx>
                                                <TextField
                                                    value-bind="$page.filter.fullName"
                                                    style="width: 100%"
                                                    autoFocus
                                                />
                                            </cx>
                                        }
                                    },
                                    {
                                        header: {
                                            items: <cx>
                                                <TextField
                                                    value-bind="$page.filter.continent"
                                                    style="width: 100%"
                                                />
                                            </cx>
                                        }
                                    },
                                    {
                                        header: {
                                            items: <cx>
                                                <TextField
                                                    value-bind="$page.filter.browser"
                                                    style="width: 100%"
                                                />
                                            </cx>
                                        }
                                    },
                                    {
                                        header: {
                                            items: <cx>
                                                <TextField
                                                    value-bind="$page.filter.os"
                                                    style="width: 100%"
                                                />
                                            </cx>
                                        }
                                    },
                                    {
                                        header: {
                                            items: <cx>
                                                <NumberField
                                                    value-bind="$page.filter.visits"
                                                    style="width: 100%"
                                                    inputStyle="text-align: right"
                                                />
                                            </cx>
                                        }
                                    }, {
                                        header: {
                                            align: 'center',
                                            items: <cx>
                                                <cx>
                                                    <Button
                                                        mod="hollow"
                                                        icon="close"
                                                        onClick={(e, {store}) => {
                                                            store.toggle('$page.showGridFilter');
                                                        }}
                                                    />
                                                </cx>
                                            </cx>
                                        }
                                    }
                                ]
                            },
                            line3: {
                                visible: {expr: "{$record.showDescription}"},
                                columns: [{
                                    colSpan: 1000,
                                    style: 'border-top-color: rgba(0, 0, 0, 0.05)',
                                    items: <cx>
                                        <Svg style="width:100%px; height:400px;">
                                            <Chart offset="20 -10 -40 40"
                                                   axes={{x: {type: NumericAxis}, y: {type: NumericAxis, vertical: true}}}>
                                                <Gridlines/>
                                                <LineGraph data-bind="$record.points" colorIndex={8}/>
                                            </Chart>
                                        </Svg>
                                    </cx>
                                }]
                            }
                        }}
                    />
                `}</CodeSnippet>
            </Content>
        </CodeSplit>
    </Md>
</cx>;
