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
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/charts/column-graph/standard.tsx" target="_blank" putInto="github">GitHub</a>
    <Section mod="well">
        <FlexRow direction="column" target='desktop' controller={PageController} >
            <Legend />
            <Svg style="height:500px; width:100%; min-width:400px;" >
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
        </FlexRow>
    </Section>
</cx>

import { hmr } from '../../hmr.js';
hmr(module);