import { HtmlElement, TextField } from 'cx/widgets';
import { Controller } from 'cx/ui';
import { Svg, Rectangle, ClipRect } from 'cx/svg';
import { Chart, TimeAxis, NumericAxis, Range, Marker, Gridlines, ColumnGraph } from 'cx/charts';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';


class PageController extends Controller {
    init() {
        super.init();

        this.store.init('$page.range', {
            from: new Date(2011, 0, 1),
            to: new Date(2012, 0, 1),
        });

        var v = 2000;

        this.store.init('$page.data', Array.from({length: 10 * 12}, (x, i)=>({
            date: new Date(2005, i, 1),
            value: v = (v + Math.random() * 300 - 150)
        })));
    }
}

export const Timeline = <cx>
    <Md>
        <CodeSplit>
            # Timeline

            This example illustrates how to use Range and ClipRect to create a chart with dynamic range.

            <div controller={PageController}>
                <Svg style="width:100%;height:600px;" margin="60 10 60 60">
                    <Chart
                        anchors="0 1 0.8 0"
                        offset="0 0 -50 0"
                        axes={{
                            x: <TimeAxis min:bind="$page.range.from" max:bind="$page.range.to" snapToTicks={false}/>,
                            y: <NumericAxis vertical/>,
                        }}>
                        <Rectangle fill="white"/>
                        <Gridlines />
                        <ClipRect>
                            <ColumnGraph data:bind="$page.data"
                                         colorIndex={4}
                                         offset={15 * 24 * 60 * 60 * 1000} //15 days
                                         size={30 * 24 * 60 * 60 * 1000} //30 days
                                         xField="date"
                                         yField="value"/>
                        </ClipRect>
                    </Chart>

                    <Chart
                        anchors="0.8 1 1 0"
                        axes={{
                            x: <TimeAxis />,
                            y: <NumericAxis vertical/>,
                        }}>
                        <Rectangle fill="white"/>
                        <Gridlines />
                        <ColumnGraph
                            data:bind="$page.data"
                            size={30 * 24 * 60 * 60 * 1000}
                            offset={15 * 24 * 60 * 60 * 1000}
                            xField="date"
                            yField="value"
                        />

                        <Range x1:bind="$page.range.from"
                               x2:bind="$page.range.to"
                               hidden>
                            <ClipRect>
                                <ColumnGraph
                                    data:bind="$page.data"
                                    colorIndex={4}
                                    size={30 * 24 * 60 * 60 * 1000}
                                    offset={15 * 24 * 60 * 60 * 1000}
                                    xField="date"
                                    yField="value"
                                />
                            </ClipRect>
                            <Range colorIndex={4}
                                   x1:bind="$page.range.from"
                                   x2:bind="$page.range.to"
                                   style="cursor:move"
                                   draggableX
                                   constrainX/>
                        </Range>

                        <Marker
                            colorIndex={4}
                            x:bind="$page.range.from"
                            size={10}
                            draggableX
                            constrain
                        />

                        <Marker
                            colorIndex={4}
                            x:bind="$page.range.to"
                            size={10}
                            draggableX
                            constrain
                        />

                    </Chart>
                </Svg>
            </div>

            <CodeSnippet putInto="code">{`
            class PageController extends Controller {
                init() {
                    super.init();

                    this.store.init('$page.range', {
                        from: new Date(2011, 0, 1),
                        to: new Date(2012, 0, 1),
                    });

                    var v = 2000;

                    this.store.init('$page.data', Array.from({length: 10 * 12}, (x, i)=>({
                        date: new Date(2005, i, 1),
                        value: v = (v + Math.random() * 300 - 150)
                    })));
                }
            }
            ...
            <div controller={PageController}>
                <Svg style="width:100%;height:600px;" margin="60 10 60 60">
                    <Chart
                        anchors="0 1 0.8 0"
                        offset="0 0 -50 0"
                        axes={{
                            x: <TimeAxis min:bind="$page.range.from" max:bind="$page.range.to" snapToTicks={false}/>,
                            y: <NumericAxis vertical/>,
                        }}>
                        <Rectangle fill="white"/>
                        <Gridlines />
                        <ClipRect>
                            <ColumnGraph data:bind="$page.data"
                                         colorIndex={4}
                                         offset={15 * 24 * 60 * 60 * 1000} //15 days
                                         size={30 * 24 * 60 * 60 * 1000} //30 days
                                         xField="date"
                                         yField="value"/>
                        </ClipRect>
                    </Chart>

                    <Chart
                        anchors="0.8 1 1 0"
                        axes={{
                            x: <TimeAxis />,
                            y: <NumericAxis vertical/>,
                        }}>
                        <Rectangle fill="white"/>
                        <Gridlines />
                        <ColumnGraph
                            data:bind="$page.data"
                            size={30 * 24 * 60 * 60 * 1000}
                            offset={15 * 24 * 60 * 60 * 1000}
                            xField="date"
                            yField="value"
                        />

                        <Range x1:bind="$page.range.from"
                               x2:bind="$page.range.to"
                               hidden>
                            <ClipRect>
                                <ColumnGraph
                                    data:bind="$page.data"
                                    colorIndex={4}
                                    size={30 * 24 * 60 * 60 * 1000}
                                    offset={15 * 24 * 60 * 60 * 1000}
                                    xField="date"
                                    yField="value"
                                />
                            </ClipRect>
                            <Range colorIndex={4}
                                   x1:bind="$page.range.from"
                                   x2:bind="$page.range.to"
                                   style="cursor:move"
                                   draggableX
                                   constrainX/>
                        </Range>

                        <Marker
                            colorIndex={4}
                            x:bind="$page.range.from"
                            size={10}
                            draggableX
                            constrain
                        />

                        <Marker
                            colorIndex={4}
                            x:bind="$page.range.to"
                            size={10}
                            draggableX
                            constrain
                        />

                    </Chart>
                </Svg>
            </div>
            `}</CodeSnippet>
        </CodeSplit>
    </Md>
</cx>;