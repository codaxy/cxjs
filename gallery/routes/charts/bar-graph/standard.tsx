import {cx, Section, FlexRow} from 'cx/widgets';
import {bind, expr, tpl, Controller, KeySelection} from 'cx/ui';
import {Chart, NumericAxis, CategoryAxis, Gridlines, BarGraph, Legend} from 'cx/charts';
import {Svg} from 'cx/svg';
import casual from '../../../util/casual';

class PageController extends Controller {
    init() {
        super.init();
        var v1 = 100;
        var v2 = 110;
        this.store.set('$page.points', Array.from({length: 11}, (_, i) => ({
            y: casual.city,
            v1: v1 = (v1 + (Math.random() - 0.5) * 30),
            v2: v2 = (v2 + (Math.random() - 0.5) * 30)
        })));
    }
}

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/charts/bar-graph/states.tsx" target="_blank" putInto="github">GitHub</a>
    <Section mod="well" controller={PageController}>
        <FlexRow direction="column" style="max-width: 600px">
            <Svg style="width:100%; height:400px;">
                <Chart offset="20 -20 -30 120" axes={{
                    x: {type: NumericAxis, snapToTicks: 1},
                    y: {type: CategoryAxis, vertical: true}
                }}>
                    <Gridlines/>
                    <BarGraph data={bind("$page.points")}
                        colorIndex={0}
                        name="V1"
                        active={bind("$page.showV1")}
                        size={0.3}
                        offset={-0.15}
                        xField="v1"
                        selection={{
                            type: KeySelection,
                            bind: '$page.selected.y',
                            keyField: 'y'
                        }}
                    />
                    <BarGraph data={bind("$page.points")}
                        colorIndex={6}
                        name="V2"
                        active={bind("$page.showV2")}
                        size={0.3}
                        offset={+0.15}
                        xField="v2"
                        selection={{
                            type: KeySelection,
                            bind: '$page.selected.y',
                            keyField: 'y'
                        }}/>
                </Chart>
            </Svg>
            <Legend />
        </FlexRow>
    </Section>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);