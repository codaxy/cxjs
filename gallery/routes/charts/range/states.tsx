import { cx, Section, FlexRow } from 'cx/widgets';
import { bind, expr, tpl, Controller, KeySelection } from 'cx/ui';
import { Range, Chart, NumericAxis, Gridlines, LineGraph, Marker, Legend } from 'cx/charts';
import { Svg, Text } from 'cx/svg';
import casual from '../../../util/casual';

class PageController extends Controller {
    init() {
        super.init();
        var y = 100;
        this.store.set(
            "$page.points",
            Array.from({ length: 101 }, (_, i) => ({
                x: i * 4,
                y: y = y + (Math.random() - 0.4) * 30
            }))
        );

        this.store.set("$page.p1", { x: 150, y: 250 });
        this.store.set("$page.p2", { x: 250, y: 350 });
    }
}

export default <cx>
    <FlexRow wrap spacing='large' target='desktop' controller={PageController} >
        <Section mod="well" >
            <FlexRow align="center" >
                <Svg style="width:600px; height:400px;">
                    <Chart
                        offset="20 -10 -40 40"
                        axes={
                            {
                                x: { type: NumericAxis },
                                y: { type: NumericAxis, vertical: true }
                            }
                        }
                    >
                        <Gridlines />
                        <Range
                            x1={bind("$page.p1.x")}
                            x2={bind("$page.p2.x")}
                            colorIndex={11}
                            name="X Range"
                            active={bind("$page.yrange")}
                        >
                            <Text anchors="0 0.5 0 0.5" offset="5 0 0 0" ta="middle" dy="0.8em">
                                X Range
                            </Text>
                        </Range>
                        <Range
                            y1={bind("$page.p1.y")}
                            y2={bind("$page.p2.y")}
                            colorIndex={8}
                            name="Y Range"
                            active={bind("$page.xrange")}
                        >
                            <Text anchors="0.5 0 0.5 0" dy="0.4em" dx={5}>Y Range</Text>
                        </Range>
                        <LineGraph data={bind("$page.points")} colorIndex={0} />
                        <Marker colorIndex={11} x={bind("$page.p1.x")} size={10} draggableX />
                        <Marker colorIndex={11} x={bind("$page.p2.x")} size={10} draggableX />
                        <Marker colorIndex={8} y={bind("$page.p1.y")} size={10} draggableY />
                        <Marker colorIndex={8} y={bind("$page.p2.y")} size={10} draggableY />
                    </Chart>
                </Svg>
                <Legend vertical />
            </FlexRow>
        </Section>
    </FlexRow >
</cx >

import { hmr } from '../../hmr.js';
hmr(module);