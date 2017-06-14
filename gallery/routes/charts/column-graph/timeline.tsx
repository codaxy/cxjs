import { cx, Section, FlexRow, Repeater, Checkbox } from 'cx/widgets';
import { bind, expr, tpl, Controller, KeySelection } from 'cx/ui';
import { Chart, Legend, Gridlines, LineGraph, CategoryAxis, 
    NumericAxis, ColumnGraph, TimeAxis, Range, Marker } from 'cx/charts';
import { Svg, Line, Rectangle, Text, ClipRect } from 'cx/svg';
import casual from '../../../util/casual';

class PageController extends Controller {
    init() {
        super.init();
        var v1 = 100;
        var v2 = 110;
        this.store.set('$page.points', Array.from({ length: 11 }, (_, i) => ({
            x: casual.city,
            v1: v1 = (v1 + (Math.random() - 0.5) * 30),
            v2: v2 = (v2 + (Math.random() - 0.5) * 30)
        })));

        this.store.init('$page.range', {
            from: new Date(2011, 0, 1),
            to: new Date(2012, 0, 1),
        });

        var v = 2000;

        this.store.init('$page.data', Array.from({ length: 10 * 12 }, (x, i) => ({
            date: new Date(2005, i, 1),
            value: v = (v + Math.random() * 300 - 150)
        })));
    }
}

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/charts/column-graph/timeline.tsx" target="_blank" putInto="github">GitHub</a>
    <Section mod="well" controller={PageController}>
        <Svg style="width:100%; min-width:400px; height: 550px;" margin="60 10 60 60">
            <Chart
                anchors="0 1 0.8 0"
                offset="0 0 -50 0"
                axes={{
                    x: <TimeAxis min={bind("$page.range.from")} max={bind("$page.range.to")} snapToTicks={false}/>,
                    y: <NumericAxis vertical/>,
                }}>
                <Rectangle fill="white"/>
                <Gridlines />
                <ClipRect>
                    <ColumnGraph data={bind("$page.data")}
                                 colorIndex={4}
                                 offset={15 * 24 * 60 * 60 * 1000}
                                 size={30 * 24 * 60 * 60 * 1000}
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
                    data={bind("$page.data")}
                    size={30 * 24 * 60 * 60 * 1000}
                    offset={15 * 24 * 60 * 60 * 1000}
                    xField="date"
                    yField="value"
                />
            
                <Range x1={bind("$page.range.from")}
                       x2={bind("$page.range.to")}
                       hidden>
                    <ClipRect>
                        <ColumnGraph
                            data={bind("$page.data")}
                            colorIndex={4}
                            size={30 * 24 * 60 * 60 * 1000}
                            offset={15 * 24 * 60 * 60 * 1000}
                            xField="date"
                            yField="value"
                        />
                    </ClipRect>
                    <Range colorIndex={4}
                           x1={bind("$page.range.from")}
                           x2={bind("$page.range.to")}
                           style="cursor:move"
                           draggableX
                           constrainX/>
                </Range>
            
                <Marker
                    colorIndex={4}
                    x={bind("$page.range.from")}
                    size={10}
                    draggableX
                    constrain
                />
            
                <Marker
                    colorIndex={4}
                    x={bind("$page.range.to")}
                    size={10}
                    draggableX
                    constrain
                />
            
            </Chart>
        </Svg>
    </Section>
</cx>

import { hmr } from '../../hmr.js';
hmr(module);