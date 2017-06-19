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

      var v1 = 500;
      var v2 = 500;
      var v3 = 500;
      this.store.set('$page.points4', Array.from({length: 10}, (_, i) => ({
         x: 2000 + i,
         v1: v1 = v1 + (Math.random() - 0.5) * 100,
         v2: v2 = v2 + (Math.random() - 0.5) * 100,
         v3: v3 = v3 + (Math.random() - 0.5) * 100,
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
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/charts/column/normalized.tsx" target="_blank" putInto="github">Source Code</a>
    <Section mod="well"
        controller={PageController}
        bodyStyle="display:flex; flex-direction: column;"
        style="height: 100%"
    >
        <Svg style="width: 100%; flex: 1;">
           <Chart offset="20 -20 -40 40" axes={{
                 x: window.innerWidth >= mw ? CategoryAxis : {type: CategoryAxis, labelAnchor: "end", labelRotation: -45, labelDy: '0.35em' },
                 y: { type: NumericAxis, vertical: true, normalized: true, format: 'p' }
              }}>
              <Gridlines/>
              <Repeater records={bind("$page.points4")} recordName="$point">
                 <Column name="V1"
                         active={bind("$page.normalized.v1")}
                         colorIndex={0}
                         x={bind("$point.x")}
                         y={bind("$point.v1")}
                         tooltip={tpl("V1 {$point.x} {$point.v1:n}")}
                         stacked />
                        
                 <Column name="V2"
                         active={bind("$page.normalized.v2")}
                         colorIndex={2}
                         x={bind("$point.x")}
                         y={bind("$point.v2")}
                         tooltip={tpl("V2 {$point.x} {$point.v2:n}")}
                         stacked />
                        
                 <Column name="V3"
                         active={bind("$page.normalized.v3")}
                         colorIndex={4}
                         x={bind("$point.x")}
                         y={bind("$point.v3")}
                         tooltip={tpl("V3 {$point.x} {$point.v3:n}")}
                         stacked />
                        
              </Repeater>
           </Chart>      
        </Svg>
        <Legend /> 
    </Section>
</cx>

import { hmr } from '../../hmr.js';
 +hmr(module);