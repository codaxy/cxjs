import { Content, ContentPlaceholder, HtmlElement, Tab } from 'cx/widgets';
import { ContentPlaceholderScope, Controller, KeySelection } from 'cx/ui';
import { Svg } from 'cx/svg';
import { Gridlines, NumericAxis, CategoryAxis, Chart, BarGraph, Legend } from 'cx/charts';
import { Md } from 'docs/components/Md';
import { CodeSplit } from 'docs/components/CodeSplit';
import { CodeSnippet } from 'docs/components/CodeSnippet';
import { ConfigTable } from 'docs/components/ConfigTable';
import { ImportPath } from 'docs/components/ImportPath';
import { casual } from 'docs/content/examples/data/casual';



class PageController extends Controller {
    onInit() {
        var v1 = 150;
        var v2 = 200;
        this.store.set('$page.points', Array.from({ length: 50 }, (_, i) => ({
            y: casual.city,
            v1: v1 = (v1 + (Math.random() - 0.5) * 30),
            v2: v2 = (v2 + (Math.random() - 0.5) * 30)
        })).sort((a, b) => a.v2 - b.v2));
    }
}


export const ScrollableBars = <cx>
    <Md>
        <CodeSplit>
            # Scrollable Bar Chart

            It can be challanging to display data properly if there are many data points.
            One option is to reduce the size of bars, but that works only up to the point. The other option is to
            display top N results and optionally group the rest in the "Other" category. The third option is to introduce
            vertical scrolling. This approach works similar to the top N approach, however, all results are there and the
            number of visible items depends only on available screen real-estate.

            <div class="widgets" controller={PageController} style="display: block">
                <div>
                    <Legend horizontal style="margin-bottom: 16px" />
                    <ContentPlaceholderScope name="xAxis">
                        <div style="overflow-y: auto; max-height: 500px">
                            <Svg style={{ width: "auto", height: { expr: "{$page.points.length} * 30" } }}>
                                <Chart offset="1 -20 0 150" axes={{
                                    x: {
                                        type: NumericAxis,
                                        snapToTicks: 1,
                                        putInto: "xAxis",
                                        anchors: "0 1 0 0",
                                        offset: "-1 0 0 0"
                                    },
                                    y: { type: CategoryAxis, vertical: true }
                                }}>
                                    <Gridlines />
                                    <BarGraph
                                        data-bind="$page.points"
                                        colorIndex={0}
                                        name="V1"
                                        size={0.3}
                                        offset={-0.15}
                                        xField="v1"
                                        selection={{
                                            type: KeySelection,
                                            bind: '$page.selected.y',
                                            keyField: 'y'
                                        }}
                                    />

                                    <BarGraph
                                        data-bind="$page.points"
                                        colorIndex={6}
                                        name="V2"
                                        size={0.3}
                                        offset={+0.15}
                                        xField="v2"
                                        selection={{
                                            type: KeySelection,
                                            bind: '$page.selected.y',
                                            keyField: 'y'
                                        }}
                                    />
                                </Chart>
                            </Svg>
                        </div>
                        <div style="margin-top: -1px">
                            <Svg style="height: 50px; width: auto">
                                <ContentPlaceholder name="xAxis" />
                            </Svg>
                        </div>
                    </ContentPlaceholderScope>
                </div>
            </div>

            <Content name="code">
                <div>
                    <Tab value-bind="$page.code.tab" tab="chart" mod="code" text='Chart' default/>
                </div>

                <CodeSnippet fiddle="9CmNf7Ez" visible-expr="{$page.code.tab}=='chart'">{`
                <Legend horizontal style="margin-bottom: 16px" />
                <ContentPlaceholderScope name="xAxis">
                    <div style="overflow-y: auto; max-height: 500px">
                        <Svg style={{ width: "auto", height: { expr: "{$page.points.length} * 30" } }}>
                            <Chart offset="1 -20 0 150" axes={{
                                x: {
                                    type: NumericAxis,
                                    snapToTicks: 1,
                                    putInto: "xAxis",
                                    anchors: "0 1 0 0",
                                    offset: "-1 0 0 0"
                                },
                                y: { type: CategoryAxis, vertical: true }
                            }}>
                                <Gridlines />
                                <BarGraph
                                    data-bind="$page.points"
                                    colorIndex={0}
                                    name="V1"
                                    size={0.3}
                                    offset={-0.15}
                                    xField="v1"
                                    selection={{
                                        type: KeySelection,
                                        bind: '$page.selected.y',
                                        keyField: 'y'
                                    }}
                                />

                                <BarGraph
                                    data-bind="$page.points"
                                    colorIndex={6}
                                    name="V2"
                                    size={0.3}
                                    offset={+0.15}
                                    xField="v2"
                                    selection={{
                                        type: KeySelection,
                                        bind: '$page.selected.y',
                                        keyField: 'y'
                                    }}
                                />
                            </Chart>
                        </Svg>
                    </div>
                    <div style="margin-top: -1px">
                        <Svg style="height: 50px; width: auto">
                            <ContentPlaceholder name="xAxis" />
                        </Svg>
                    </div>
                </ContentPlaceholderScope>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>
    </Md>
</cx >

