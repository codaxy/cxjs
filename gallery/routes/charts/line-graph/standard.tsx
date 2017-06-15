import {cx, Section, FlexRow, Repeater, Checkbox} from 'cx/widgets';
import {bind, expr, tpl, Controller, KeySelection} from 'cx/ui';
import { Chart, Legend, ColorMap, Gridlines, LineGraph, NumericAxis } from 'cx/charts';
import {Svg, Line, Rectangle, Text} from 'cx/svg';

class PageController extends Controller {
   init() {
      super.init();
      var y1 = 150, y2 = 250;
      this.store.set('standard.points', Array.from({length: 101}, (_, i) => ({
         x: i * 4,
         y: i % 20 == 3 ? null : (y1 = (y1 + (Math.random() - 0.5) * 30)),
         y2: y2 = (y2 + (Math.random() - 0.5) * 30),
         y2l: y2 - 50,
         y2h: y2 + 50
      })));
   }
}

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/charts/line-graph/standard.tsx" target="_blank" putInto="github">Source Code</a>
    <Section mod="well" controller={PageController}>
        <FlexRow direction="column" >
            <Svg style="width:100%; height:566px;">
               <Chart offset="20 -10 -40 40" axes={{ x: { type: NumericAxis }, y: { type: NumericAxis, vertical: true } }}>
                  <Gridlines/>
                  <LineGraph data={bind("standard.points")} colorIndex={8} yField="y2h" y0Field="y2l" active={bind("standard.line2")} line={false} area/>
                  <LineGraph name="Line 1" data={bind("standard.points")} colorIndex={0} area active={bind("standard.line1")} />
                  <LineGraph name="Line 2" data={bind("standard.points")} colorIndex={8} yField="y2" active={bind("standard.line2")} />
               </Chart>
            </Svg>
            <Legend />
        </FlexRow>
    </Section>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);