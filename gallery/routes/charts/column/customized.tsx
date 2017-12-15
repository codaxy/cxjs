import {cx, Section, FlexRow, Repeater, Checkbox, Grid} from 'cx/widgets';
import {bind, expr, tpl, Controller, KeySelection} from 'cx/ui';
import {
    Chart, Gridlines, CategoryAxis,
    NumericAxis, Column
} from 'cx/charts';
import {Svg} from 'cx/svg';
import casual from '../../../util/casual';

class PageController extends Controller {
    onInit() {
        let mw = 768;
        let length = window.innerWidth >= mw ? 30 : 12;
        this.store.set('$page.points', Array.from({length}, (_, i) => ({
            x: casual.city,
            y: 10 + (i + 1) / 30 * 40 + (Math.random() - 0.5) * 10
        })));
    }
}
export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/charts/column/customized.tsx" target="_blank"
        putInto="github">Source Code</a>

    <Section mod="well"
        controller={PageController}
        bodyStyle="display:flex; flex-direction: column;"
        style="height: 100%"
    >
        <Svg style="width: 100%; flex: 1;">
            <Chart offset="20 -20 -120 40" axes={{
                x: {type: CategoryAxis, labelRotation: -45, labelDy: '0.4em', labelAnchor: "end"},
                y: {type: NumericAxis, vertical: true}
            }}>
                <Gridlines/>
                <Repeater records={bind("$page.points")} recordName="$point">
                    <Column colorIndex={expr("15 - Math.round({$point.y}*6/50)")}
                        width={0.8}
                        x={bind("$point.x")}
                        y={bind("$point.y")}
                        tooltip={tpl("{$point.x} {$point.y:n;0}")}/>
                </Repeater>
            </Chart>
        </Svg>
    </Section>
</cx>

import {hmr} from '../../hmr.js';
+hmr(module);