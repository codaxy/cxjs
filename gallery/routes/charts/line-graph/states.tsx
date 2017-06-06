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
    <FlexRow wrap spacing='large' target='desktop' controller={PageController} >
        <Section mod="well" title="Standard" hLevel={4} >
            <Legend.Scope>
            <Svg style="width:600px; height:400px;">
               <Chart offset="20 -10 -40 40" axes={{ x: { type: NumericAxis }, y: { type: NumericAxis, vertical: true } }}>
                  <Gridlines/>
                  <LineGraph data={bind("standard.points")} colorIndex={8} yField="y2h" y0Field="y2l" active={bind("standard.line2")} line={false} area/>
                  <LineGraph name="Line 1" data={bind("standard.points")} colorIndex={0} area active={bind("standard.line1")} />
                  <LineGraph name="Line 2" data={bind("standard.points")} colorIndex={8} yField="y2" active={bind("standard.line2")} />
               </Chart>
            </Svg>
            <Legend />
            </Legend.Scope>
        </Section>
        <Section mod="well" title="Stacked" hLevel={4} >
            <Legend.Scope>
            <Svg style="width:600px; height:400px;">
               <Chart offset="20 -10 -40 40" axes={{ x: { type: NumericAxis }, y: { type: NumericAxis, vertical: true } }}>
                  <Gridlines/>
                  <LineGraph name="Line 1" data={bind("stack.points")} colorIndex={0} area={bind("stacked")} yField="y1" active={bind("stack.line1")} stacked={bind("stacked")} />
                  <LineGraph name="Line 2" data={bind("stack.points")} colorIndex={5} area={bind("stacked")} yField="y2" active={bind("stack.line2")} stacked={bind("stacked")} />
                  <LineGraph name="Line 3" data={bind("stack.points")} colorIndex={10} area={bind("stacked")} yField="y3" active={bind("stack.line3")} stacked={bind("stacked")} />
               </Chart>
            </Svg>
            <Legend />
            <Checkbox value={bind("stacked")}>Stack</Checkbox>
            </Legend.Scope>
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);