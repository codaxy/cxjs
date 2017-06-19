import {cx, Section, FlexRow, Repeater, Checkbox} from 'cx/widgets';
import {bind, expr, tpl, Controller, KeySelection} from 'cx/ui';
import { Chart, Legend, ColorMap, Gridlines, LineGraph, NumericAxis } from 'cx/charts';
import {Svg, Line, Rectangle, Text} from 'cx/svg';

class PageController extends Controller {
   init() {
      super.init();
      this.store.set('stacked', true);
      var y1 = 300, y2 = 200, y3 = 100;
      this.store.set('stack.points', Array.from({length: 101}, (_, i) => ({
         x: i * 4,
         y1: y1 = (y1 + (Math.random() - 0.5) * 30),
         y2: y2 = (y2 + (Math.random() - 0.5) * 30),
         y3: y3 = (y3 + (Math.random() - 0.5) * 30)
      })));
   }
}

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/charts/line-graph/stacked.tsx" target="_blank" putInto="github">Source Code</a>
    <Section mod="well" 
        controller={PageController}
        style="height: 100%;"
        bodyStyle="display: flex; flex-direction: column;">
        <Checkbox value={bind("stacked")}>Stack</Checkbox>
        <Svg style="width:100%; flex: 1;">
           <Chart offset="20 -10 -40 40" axes={{ x: { type: NumericAxis }, y: { type: NumericAxis, vertical: true } }}>
              <Gridlines/>
              <LineGraph name="Line 1" data={bind("stack.points")} colorIndex={0} area={bind("stacked")} yField="y1" active={bind("stack.line1")} stacked={bind("stacked")} />
              <LineGraph name="Line 2" data={bind("stack.points")} colorIndex={5} area={bind("stacked")} yField="y2" active={bind("stack.line2")} stacked={bind("stacked")} />
              <LineGraph name="Line 3" data={bind("stack.points")} colorIndex={10} area={bind("stacked")} yField="y3" active={bind("stack.line3")} stacked={bind("stacked")} />
           </Chart>
        </Svg>
        <Legend />
    </Section>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);