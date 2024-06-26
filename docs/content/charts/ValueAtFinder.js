import { Repeater, Grid, Content, Tab, Checkbox } from 'cx/widgets';
import { Controller } from 'cx/ui';
import { Svg } from 'cx/svg';
import { Chart, NumericAxis, MouseTracker, Gridlines, Marker, MarkerLine, ColorMap, LineGraph, ValueAtFinder, LegendEntry, Legend } from 'cx/charts';
import { Md } from '../../components/Md';
import { CodeSplit } from '../../components/CodeSplit';
import { CodeSnippet } from '../../components/CodeSnippet';
import { ConfigTable } from '../../components/ConfigTable';
import { ImportPath } from 'docs/components/ImportPath';

import configs from './configs/ValueAtFinder';

class ChartController extends Controller {
    onInit() {
        this.store.set('$page.series', Array.from({length: 5}, (_, i) => {
            var y = 100 + Math.random() * 200;
            return {
                name: 'Series ' + (i + 1),
                trackedValue: null,
                points: Array.from({length: 26}, (_, x) => ({
                    x: x * 4,
                    y: (y = y + Math.random() * 100 - 45)
                }))
            }
        }));

        this.colorMapCache = {};
    }

    getColorMapCache() {
        return this.colorMapCache;
    }
}

export const ValueAtFinderPage = <cx>
    <Md>
        # ValueAtFinder
        <ImportPath path="import {ValueAtFinder} from 'cx/charts';"/>

        <CodeSplit>

            The `ValueAtFinder` helper widget is used to read values from the graph at the given position.
            This widget is commonly used with `MouseTracker` and tooltips to enable value tooltips for line graphs.

            <div class="widgets" controller={ChartController}>
                <Svg style="width:600px;height:500px;" offset="10 -10 -20 40">
                    <Chart axes={{
                        x: <NumericAxis />,
                        y: <NumericAxis vertical/>,
                    }}>
                        <Gridlines />
                        <MouseTracker
                            x-bind="$page.cursor.x"
                            tooltip={{
                                destroyDelay: 5,
                                createDelay: 5,
                                items: <cx>
                                    <ColorMap onGetCache="getColorMapCache"/>
                                    <Grid
                                        defaultSortField="trackedValue"
                                        defaultSortDirection="DESC"
                                        records-bind="$page.series"
                                        columns={[
                                            { field: 'name', items: <cx>
                                                <LegendEntry
                                                    name-bind="$record.name"
                                                    text-bind="$record.name"
                                                    active-bind="$record.active"
                                                    shape="circle"
                                                    colorMap="lines"
                                                    size={10}
                                                />
                                            </cx> },
                                            { field: 'trackedValue', format: 'n;2' }
                                        ]}
                                    />
                                </cx>,
                                trackMouse: true
                            }}
                        >
                            <MarkerLine visible-expr="!!{$page.cursor}" x-bind="$page.cursor.x" affectsAxes={false} />

                            <ColorMap onGetCache="getColorMapCache" />

                            <Repeater records-bind="$page.series">
                                <ValueAtFinder at-bind="$page.cursor.x" value-bind="$record.trackedValue">
                                    <LineGraph name-bind="$record.name"
                                        active-bind="$record.active"
                                        data-bind="$record.points"
                                        colorMap="lines"
                                        stacked-bind="$page.stacked"
                                        area-bind="$page.stacked"
                                    />
                                </ValueAtFinder>
                                <Marker
                                    name-bind="$record.name"
                                    active-bind="$record.active"
                                    x-bind="$page.cursor.x"
                                    y-bind="$record.trackedValue"
                                    colorMap="lines"
                                    size={10}
                                    stackedY-bind="$page.stacked"
                                    affectsAxes={false}
                                    stack="markers"
                                />
                            </Repeater>
                        </MouseTracker>
                    </Chart>
                </Svg>
                <Legend/>
                <Checkbox value-bind="$page.stacked" text="Stack" />
            </div>
            <Content name="code">
                <div style={{ maxWidth: "60%" }}>
                    <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller"/>
                    <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default/>
                    <Tab value-bind="$page.code.tab" mod="code" tab="columns" text="Columns"/>
                </div>

                <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="hqzog4YJ">{`
                    class ChartController extends Controller {
                        onInit() {
                            this.store.set('$page.series', Array.from({length: 5}, (_, i) => {
                                var y = 100 + Math.random() * 200;
                                return {
                                    name: 'Series ' + (i + 1),
                                    trackedValue: null,
                                    points: Array.from({length: 26}, (_, x) => ({
                                        x: x * 4,
                                        y: (y = y + Math.random() * 100 - 45)
                                    }))
                                }
                            }));

                            this.colorMapCache = {};
                        }

                        getColorMapCache() {
                            return this.colorMapCache;
                        }
                    }
                `}</CodeSnippet>
                <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="hqzog4YJ">{`
                <Svg style="width:600px;height:500px;" offset="10 -10 -20 40">
                <Chart axes={{
                    x: <NumericAxis />,
                    y: <NumericAxis vertical/>,
                }}>
                    <Gridlines />
                    <MouseTracker
                        x-bind="$page.cursor.x"
                        tooltip={{
                            destroyDelay: 5,
                            createDelay: 5,
                            items: <cx>
                                <ColorMap onGetCache="getColorMapCache"/>
                                <Grid
                                    defaultSortField="trackedValue"
                                    defaultSortDirection="DESC"
                                    records-bind="$page.series"
                                    columns={columns}
                                />
                            </cx>,
                            trackMouse: true
                        }}
                    >
                        <MarkerLine visible-expr="!!{$page.cursor}" x-bind="$page.cursor.x" />

                        <ColorMap onGetCache="getColorMapCache" />

                        <Repeater records-bind="$page.series">
                            <ValueAtFinder at-bind="$page.cursor.x" value-bind="$record.trackedValue">
                                <LineGraph name-bind="$record.name"
                                    active-bind="$record.active"
                                    data-bind="$record.points"
                                    colorMap="lines"
                                    stacked-bind="$page.stacked"
                                    area-bind="$page.stacked"
                                />
                            </ValueAtFinder>
                            <Marker
                                name-bind="$record.name"
                                active-bind="$record.active"
                                x-bind="$page.cursor.x"
                                y-bind="$record.trackedValue"
                                colorMap="lines"
                                size={10}
                                stackedY-bind="$page.stacked"
                                affectsAxes={false}
                                stack="markers"
                            />
                        </Repeater>
                    </MouseTracker>
                </Chart>
            </Svg>
            <Legend/>
            <Checkbox value-bind="$page.stacked" text="Stack" />
            `}</CodeSnippet>
                <CodeSnippet visible-expr="{$page.code.tab}=='columns'" fiddle="hqzog4YJ">{`
                    let columns = [
                        {
                            field: 'name',
                            items: (
                                <cx>
                                <LegendEntry
                                    name-bind="$record.name"
                                    text-bind="$record.name"
                                    active-bind="$record.active"
                                    shape="circle"
                                    colorMap="lines"
                                    size={10}
                                    />
                                </cx>)
                        },
                        { field: 'trackedValue', format: 'n;2' }
                    ];
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

