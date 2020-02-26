import {cx, Section} from 'cx/widgets';
import {bind, expr, tpl, Controller, PrivateStore} from 'cx/ui';
import {
    Chart, Gridlines,
    NumericAxis, ColumnGraph, TimeAxis, Range, Marker
} from 'cx/charts';
import {Svg, ClipRect} from 'cx/svg';

class PageController extends Controller {
    onInit() {
        this.store.init('range', {
            from: new Date(2011, 0, 1),
            to: new Date(2012, 0, 1),
        });

        let v = 2000;
        this.store.init('data', Array.from({length: 10 * 12}, (x, i) => ({
            date: new Date(2005, i, 1),
            value: v = (v + Math.random() * 300 - 150)
        })));
    }
}

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/charts/column-graph/timeline.tsx" target="_blank"
       putInto="github">Source Code</a>
    <Section
        mod="well"
        bodyStyle="display: flex; flex-direction: column;"
        style="height: 100%;"
    >
        <PrivateStore
            data={{}}
            controller={PageController}
            detached
        >
            <Svg style="width:100%; flex: 1;" margin="60 10 60 60">
                <Chart
                    anchors="0 1 0.8 0"
                    offset="0 0 -50 0"
                    axes={{
                        x: <TimeAxis min={bind("range.from")} max={bind("range.to")} snapToTicks={false}/>,
                        y: <NumericAxis vertical/>,
                    }}>
                    <Gridlines/>
                    <ClipRect>
                        <ColumnGraph data={bind("data")}
                                     colorIndex={8}
                                     offset={15 * 24 * 60 * 60 * 1000}
                                     size={30 * 24 * 60 * 60 * 1000}
                                     xField="date"
                                     yField="value"/>
                    </ClipRect>
                </Chart>

                <Chart
                    anchors="0.8 1 1 0"
                    axes={{
                        x: <TimeAxis/>,
                        y: <NumericAxis vertical/>,
                    }}>
                    <Gridlines/>
                    <ColumnGraph
                        data={bind("data")}
                        size={30 * 24 * 60 * 60 * 1000}
                        offset={15 * 24 * 60 * 60 * 1000}
                        xField="date"
                        yField="value"
                        colorIndex={8}
                    />

                    <Range x1={bind("range.from")}
                           x2={bind("range.to")}
                           hidden>
                        <ClipRect>
                            <ColumnGraph
                                data={bind("data")}
                                colorIndex={10}
                                size={30 * 24 * 60 * 60 * 1000}
                                offset={15 * 24 * 60 * 60 * 1000}
                                xField="date"
                                yField="value"
                            />
                        </ClipRect>
                        <Range colorIndex={9}
                               x1={bind("range.from")}
                               x2={bind("range.to")}
                               style="cursor:move"
                               draggableX
                               constrainX/>
                    </Range>

                    <Marker
                        colorIndex={9}
                        x={bind("range.from")}
                        size={10}
                        draggableX
                        constrain
                    />

                    <Marker
                        colorIndex={9}
                        x={bind("range.to")}
                        size={10}
                        draggableX
                        constrain
                    />

                </Chart>
            </Svg>
        </PrivateStore>
    </Section>
</cx>

import {hmr} from '../../hmr.js';

hmr(module);