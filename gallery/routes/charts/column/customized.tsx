import { cx, Section, FlexRow, Repeater, Checkbox, Grid } from 'cx/widgets';
import { bind, expr, tpl, Controller, KeySelection } from 'cx/ui';
import { Chart, Legend, Gridlines, LineGraph, CategoryAxis, 
    NumericAxis, ColumnGraph, TimeAxis, Range, Marker, Column } from 'cx/charts';
import { Svg, Line, Rectangle, Text, ClipRect } from 'cx/svg';
import casual from '../../../util/casual';

class PageController extends Controller {
   init() {
      super.init();

      let mw = 768;
      let length = window.innerWidth >= mw ? 30 : 12;
      this.store.set('$page.points', Array.from({length}, (_, i) => ({
         x: casual.city,
         y: 10 + (i+1) / 30 * 40 + (Math.random() - 0.5) * 10
      })));
   }
}

var columnSelection = new KeySelection({
   keyField: 'x',
   bind: '$page.selection',
   record: { bind: '$point' },
   index: { bind: '$index' }
});

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/charts/column/customized.tsx" target="_blank" putInto="github">Source Code</a>
    <Section mod="well" controller={PageController} bodyStyle="display:flex; align-items:stretch;">
        <Svg style="width:100%; height: 600px;">
           <Chart offset="20 -20 -140 40" axes={{
              x: { type: CategoryAxis, labelRotation: -45, labelDy: '0.4em', labelAnchor: "end" },
              y: { type: NumericAxis, vertical: true } }}>
              <Gridlines/>
              <Repeater records={bind("$page.points")} recordName="$point">
                 <Column colorIndex={expr("15 - Math.round({$point.y}*6/50)")}
                         width={0.8}
                         x={bind("$point.x")}
                         y={bind("$point.y")}
                         tooltip={tpl("{$point.x} {$point.y:n;0}")} />
              </Repeater>
           </Chart>
        </Svg>
    </Section>
</cx>

import { hmr } from '../../hmr.js';
 +hmr(module);