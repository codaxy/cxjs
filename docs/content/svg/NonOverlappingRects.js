import { Content, HtmlElement, Tab } from 'cx/widgets';
import { Controller, Repeater } from "cx/ui";
import { Svg, Rectangle, ClipRect, Ellipse, Text, NonOverlappingRect, NonOverlappingRectGroup } from 'cx/svg';
import { Md } from '../../components/Md';
import { CodeSplit } from '../../components/CodeSplit';
import { CodeSnippet } from '../../components/CodeSnippet';
import { ConfigTable } from '../../components/ConfigTable';
import { ImportPath } from 'docs/components/ImportPath';
import {
    Chart, Gridlines, Marker,
    NumericAxis
} from "cx/charts";

import configs from './configs/BoundedObject';

class PageController extends Controller {
    onInit() {
        this.store.set(
            "$page.data",
            Array.from({ length: 30 }, (_, i) => ({
                x: 100 + Math.random() * 300,
                y: Math.random() * 300
            }))
        );
    }
}

export const NonOverlappingRects = <cx>
    <Md>
        # NonOverlappingRect

        <ImportPath path="import { NonOverlappingRect, NonOverlappingRectGroup } from 'cx/svg';" />

        <CodeSplit>

            The `NonOverlappingRect` and `NonOverlappingRectGroup` widgets are commonly used for hiding excessive chart labels.
            In the following chart, labels which are overlapping other labels are hidden. Try dragging markers around and see how it behaves.

            <div class="widgets" controller={PageController}>
                <Svg style="width:500px; height:450px;">
                    <Chart
                        offset="50 -30 -40 130"
                        axes={{
                            x: { type: NumericAxis, snapToTicks: 1 },
                            y: { type: NumericAxis, vertical: true, snapToTicks: 1 }
                        }}
                    >
                        <NonOverlappingRectGroup>
                            <Gridlines />
                            <Repeater records-bind="$page.data" recordName="$point">
                                <Marker
                                    colorIndex={0}
                                    size={10}
                                    x-bind="$point.x"
                                    y-bind="$point.y"
                                    style={{ fillOpacity: 0.5 }}
                                    draggableX
                                    draggableY
                                >
                                    <NonOverlappingRect offset="-15 25 0 -25" anchors="0 0.5 0 0.5">
                                        <Rectangle style="fill: white; stroke: red; stroke-width: 0.5" anchors="0 1 1 0">
                                            <Text value-tpl="{$point.x:n;0}, {$point.y:n;0}" textAnchor="middle" style="font-size: 10px" dy="0.35em" />
                                        </Rectangle>
                                    </NonOverlappingRect>
                                </Marker>
                            </Repeater>
                        </NonOverlappingRectGroup>
                    </Chart>
                </Svg>
            </div>



            <Content name="code">
                <div>
                    <Tab value-bind="$page.code.tab" tab="controller" mod="code"><code>Controller</code></Tab>
                    <Tab value-bind="$page.code.tab" tab="chart" mod="code" default><code>Chart</code></Tab>
                </div>
                <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="dAzljo79">{`
                class PageController extends Controller {
                    onInit() {
                        this.store.set(
                            "$page.data",
                            Array.from({ length: 30 }, (_, i) => ({
                                x: 100 + Math.random() * 300,
                                y: Math.random() * 300
                            }))
                        );
                    }
                }
            `}</CodeSnippet>
            <CodeSnippet visible-expr="{$page.code.tab}=='chart'" fiddle="dAzljo79">{`
                <div class="widgets" controller={PageController}>
                    <Svg style="width:500px; height:450px;">
                        <Chart
                            offset="50 -20 -40 130"
                            axes={{
                                x: { type: NumericAxis, snapToTicks: 1 },
                                y: { type: NumericAxis, vertical: true, snapToTicks: 1 }
                            }}
                        >
                            <NonOverlappingRectGroup>
                                <Gridlines />
                                <Repeater records-bind="$page.data" recordName="$point">
                                    <Marker
                                        colorIndex={0}
                                        size={10}
                                        x-bind="$point.x"
                                        y-bind="$point.y"
                                        style={{ fillOpacity: 0.5 }}
                                        draggableX
                                        draggableY
                                    >
                                        <NonOverlappingRect offset="-15 25 0 -25" anchors="0 0.5 0 0.5">
                                            <Rectangle style="fill: white; stroke: red; stroke-width: 0.5" anchors="0 1 1 0">
                                                <Text value-tpl="{$point.x:n;0}, {$point.y:n;0}" textAnchor="middle" style="font-size: 10px" dy="0.35em" />
                                            </Rectangle>
                                        </NonOverlappingRect>
                                    </Marker>
                                </Repeater>
                            </NonOverlappingRectGroup>
                        </Chart>
                    </Svg>
                </div>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs} />

    </Md>
</cx>

