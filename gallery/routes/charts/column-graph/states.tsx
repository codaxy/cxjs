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
    <FlexRow wrap spacing='large' target='desktop' controller={PageController} >
        <Section mod="well" title="Standard" hLevel={4} >
            <Legend.Scope>
                <Legend />
                <Svg style="width:600px; height:400px;">
                    <Chart
                        offset="20 -20 -100 40"
                        axes={{
                            x: {
                                type: CategoryAxis,
                                snapToTicks: 0,
                                labelWrap: true,
                                labelOffset: 15,
                                labelRotation: -45,
                                labelDy: '0.3em',
                                labelAnchor: 'end',
                                labelLineCountDyFactor: -0.5
                            },
                            y: {
                                type: NumericAxis,
                                vertical: true,
                                snapToTicks: 1
                            }
                        }}
                    >
                        <Gridlines />
                        <ColumnGraph
                            data={bind("$page.points")}
                            colorIndex={0}
                            active={bind("$page.showV1")}
                            name="V1"
                            size={0.3}
                            offset={-0.15}
                            yField="v1"
                            selection={{
                                type: KeySelection,
                                bind: '$page.selected.x',
                                keyField: 'x'
                            }}
                        />

                        <ColumnGraph
                            data={bind("$page.points")}
                            colorIndex={6}
                            active={bind("$page.showV2")}
                            name="V2"
                            size={0.3}
                            offset={+0.15}
                            yField="v2"
                            selection={{
                                type: KeySelection,
                                bind: '$page.selected.x',
                                keyField: 'x'
                            }} />
                    </Chart>
                </Svg>
            </Legend.Scope>
        </Section>
        <Section mod="well" title="Timeline" hLevel={4} >
            <Legend.Scope>
                <Svg style="width:600px; height: 550px;" margin="60 10 60 60">
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
            </Legend.Scope>
        </Section>
    </FlexRow>
</cx>

import { hmr } from '../../hmr.js';
declare let module: any;
hmr(module);