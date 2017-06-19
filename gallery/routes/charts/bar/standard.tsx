import {cx, Section, FlexRow, FlexCol, Repeater} from 'cx/widgets';
import {bind, expr, tpl, Controller, KeySelection} from 'cx/ui';
import {Chart, NumericAxis, CategoryAxis, Gridlines, Bar, Legend} from 'cx/charts';
import {Svg} from 'cx/svg';
import casual from '../../../util/casual';

class PageController extends Controller {
    init() {
        super.init();
        this.store.set('$page.points', Array.from({length: 11}, (_, i) => ({
            key: casual.city,
            v1: 100 + Math.random() * 300,
            v2: 100 + Math.random() * 400
        })));
    }
}

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/charts/bar/standard.tsx" target="_blank"
        putInto="github">Source Code</a>

    <FlexRow style="height: 100%;" controller={PageController}>
        <Section mod="well"
            style="width: 100%; max-width: 700px;"
            bodyStyle="display: flex; flex-direction: column">
            <Svg style="flex: 1">
                <Chart offset="20 -20 -40 130" axes={{
                    x: {type: NumericAxis, snapToTicks: 0},
                    y: {type: CategoryAxis, vertical: true, snapToTicks: 1}
                }}>
                    <Gridlines/>
                    <Repeater records={bind("$page.points")} recordName="$point" sorters={bind("$page.sorters")}>
                        <Bar colorIndex={0}
                            name="Value 1"
                            height={0.3}
                            offset={-0.15}
                            active={bind("$page.v1")}
                            x={bind("$point.v1")}
                            y={bind("$point.key")}
                            tooltip={tpl("{$point.v1:n;0}")}/>

                        <Bar colorIndex={5}
                            name="Value 2"
                            height={0.3}
                            offset={0.15}
                            active={bind("$page.v2")}
                            x={bind("$point.v2")}
                            y={bind("$point.key")}
                            tooltip={tpl("{$point.v2:n;0}")}/>
                    </Repeater>
                </Chart>
            </Svg>
            <Legend style="max-width: 600px"/>
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);