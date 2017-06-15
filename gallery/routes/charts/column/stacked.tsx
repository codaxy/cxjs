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

      this.store.set('$page.points3', Array.from({length: categories.length}, (_, i) => ({
         x: categories[i],
         v1: Math.random() * 30,
         v2: Math.random() * 30,
         v3: Math.random() * 30,
         a1: Math.random() * 30,
         a2: Math.random() * 30,
         a3: Math.random() * 30,
      })));

   }
}

var columnSelection = new KeySelection({
   keyField: 'x',
   bind: '$page.selection',
   record: { bind: '$point' },
   index: { bind: '$index' }
});

let mw = 1000;

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/charts/column/stacked.tsx" target="_blank" putInto="github">Source Code</a>
    <Section mod="well" >
        <FlexRow target='desktop' direction="column" controller={PageController} style="min-width:400px;">
                <Legend />
                <Svg style="width:100%; height:566px;">
                   <Chart offset="20 -20 -40 40" axes={{ 
                        x: window.innerWidth >= mw ? CategoryAxis : {type: CategoryAxis, labelAnchor: "end", labelRotation: -45, labelDy: '0.35em' },
                        y: { type: NumericAxis, vertical: true, snapToTicks: 2 } 
                   }}>
                      <Gridlines/>
                      <Repeater records={bind("$page.points3")} recordName="$point">
                         <Column name="V1"
                                 active={bind("$page.v1")}
                                 colorIndex={2}
                                 width={0.3}
                                 offset={-0.15}
                                 x={bind("$point.x")}
                                 y={bind("$point.v1")}
                                 tooltip={tpl("V1 {$point.x} {$point.v1:n}")}
                                 stack="v"
                                 stacked />
                             
                         <Column name="V2"
                                 active={bind("$page.v2")}
                                 colorIndex={1}
                                 width={0.3}
                                 offset={-0.15}
                                 x={bind("$point.x")}
                                 y={bind("$point.v2")}
                                 tooltip={tpl("V2 {$point.x} {$point.v2:n}")}
                                 stack="v"
                                 stacked />
                             
                         <Column name="V3"
                                 active={bind("$page.v3")}
                                 colorIndex={0}
                                 width={0.3}
                                 offset={-0.15}
                                 x={bind("$point.x")}
                                 y={bind("$point.v3")}
                                 tooltip={tpl("V3 {$point.x} {$point.v3:n}")}
                                 stack="v"
                                 stacked />
                             
                         <Column name="A1"
                                 active={bind("$page.a1")}
                                 colorIndex={11}
                                 width={0.3}
                                 offset={0.15}
                                 x={bind("$point.x")}
                                 y={bind("$point.a1")}
                                 tooltip={tpl("A1 {$point.x} {$point.a1:n}")}
                                 stack="a"
                                 stacked />
                             
                         <Column name="A2"
                                 active={bind("$page.a2")}
                                 colorIndex={12}
                                 width={0.3}
                                 offset={0.15}
                                 x={bind("$point.x")}
                                 y={bind("$point.a2")}
                                 tooltip={tpl("A2 {$point.x} {$point.a2:n}")}
                                 stack="a"
                                 stacked />
                             
                         <Column name="A3"
                                 active={bind("$page.a3")}
                                 colorIndex={13}
                                 width={0.3}
                                 offset={0.15}
                                 x={bind("$point.x")}
                                 y={bind("$point.a3")}
                                 tooltip={tpl("A3 {$point.x} {$point.a3:n}")}
                                 stack="a"
                                 stacked />
                             
                      </Repeater>
                   </Chart>
                </Svg>
        </FlexRow>
    </Section>
</cx>

import { hmr } from '../../hmr.js';
 +hmr(module);