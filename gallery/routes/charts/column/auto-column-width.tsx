import { cx, Section, FlexRow, Repeater, Checkbox, Grid } from 'cx/widgets';
import { bind, expr, tpl, Controller, KeySelection } from 'cx/ui';
import { Chart, Legend, Gridlines, LineGraph, CategoryAxis, 
    NumericAxis, ColumnGraph, TimeAxis, Range, Marker, Column } from 'cx/charts';
import { Svg, Line, Rectangle, Text, ClipRect } from 'cx/svg';
import casual from '../../../util/casual';

var categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

class PageController extends Controller {
   init() {
      super.init();

      this.store.set('$page.points5', Array.from({length: categories.length}, (_, i) => ({
         x: categories[i],
         v1: Math.random() * 30,
         v2: Math.random() * 30,
         v3: Math.random() * 30,
         a1: Math.random() * 30,
         a2: i < 7 ? Math.random() * 30 : null,
         a3: i < 10 ? Math.random() * 30 : null,
      })));
   }
}

var columnSelection = new KeySelection({
   keyField: 'x',
   bind: '$page.selection',
   record: { bind: '$point' },
   index: { bind: '$index' }
});

let mw = 768;

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/charts/column/auto-column-width.tsx" target="_blank" putInto="github">GitHub</a>
    <Section mod="well" controller={PageController}>
        <FlexRow direction="column">
            <Legend.Scope>
                <Svg style="width:100%; height:400px;">
                   <Chart offset="20 -20 -40 40" axes={{
                         x: window.innerWidth >= mw ? CategoryAxis : { type: CategoryAxis, uniform: true, labelAnchor: "end", labelRotation: -90, labelDy: '0.35em' },
                         y: { type: NumericAxis, vertical: true, snapToTicks: 0 }
                      }}>
                      <Gridlines/>
                      <Repeater records={bind("$page.points5")} recordName="$point">
                         <Column name="V1"
                                 active={bind("$page.autoWidth.v1")}
                                 colorIndex={2}
                                 width={0.8}
                                 x={bind("$point.x")}
                                 y={bind("$point.v1")}
                                 tooltip={tpl("V1 {$point.x} {$point.v1:n}")}
                                 stack="v"
                                 stacked
                                 autoSize />
                             
                         <Column name="V2"
                                 active={bind("$page.autoWidth.v2")}
                                 colorIndex={1}
                                 width={0.8}
                                 x={bind("$point.x")}
                                 y={bind("$point.v2")}
                                 tooltip={tpl("V2 {$point.x} {$point.v2:n}")}
                                 stack="v"
                                 stacked
                                 autoSize />
                             
                         <Column name="V3"
                                 active={bind("$page.autoWidth.v3")}
                                 colorIndex={0}
                                 width={0.8}
                                 x={bind("$point.x")}
                                 y={bind("$point.v3")}
                                 tooltip={tpl("V3 {$point.x} {$point.v3:n}")}
                                 stack="z"
                                 stacked
                                 autoSize />
                             
                         <Column name="A1"
                                 active={bind("$page.autoWidth.a1")}
                                 colorIndex={11}
                                 width={0.8}
                                 x={bind("$point.x")}
                                 y={bind("$point.a1")}
                                 tooltip={tpl("A1 {$point.x} {$point.a1:n}")}
                                 stack="x"
                                 stacked
                                 autoSize />
                             
                         <Column name="A2"
                                 active={bind("$page.autoWidth.a2")}
                                 colorIndex={12}
                                 width={0.8}
                                 x={bind("$point.x")}
                                 y={bind("$point.a2")}
                                 tooltip={tpl("A2 {$point.x} {$point.a2:n}")}
                                 stack="a"
                                 stacked
                                 autoSize />
                             
                         <Column name="A3"
                                 active={bind("$page.autoWidth.a3")}
                                 colorIndex={13}
                                 width={0.8}
                                 x={bind("$point.x")}
                                 y={bind("$point.a3")}
                                 tooltip={tpl("A3 {$point.x} {$point.a3:n}")}
                                 stack="a"
                                 stacked
                                 autoSize />
                             
                      </Repeater>
                   </Chart>
                </Svg>
                <Legend />
            </Legend.Scope>
        </FlexRow>
    </Section>
</cx>

import { hmr } from '../../hmr.js';
 +hmr(module);