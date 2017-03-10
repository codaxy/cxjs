import { NumericAxis, Legend, LineGraph, Gridlines, Chart } from 'cx/charts';
import { Controller } from 'cx/ui';
import { Svg } from 'cx/svg';
import { HtmlElement } from 'cx/widgets';

class PageController extends Controller {
   init() {
      super.init();
      var y1 = 150, y2 = 250;
      this.store.set('$page.line', Array.from({length: 101}, (_, i) => ({
         x: i * 4,
         y: i % 20 == 3 ? null : (y1 = (y1 + (Math.random() - 0.5) * 30)),
         y2: y2 = (y2 + (Math.random() - 0.5) * 30),
         y2l: y2 - 50,
         y2h: y2 + 50
      })));
   }
}

export default <cx>
   <Legend.Scope>
      <Svg style="width:100%; height:400px;min-width:350px;" controller={PageController}>
         <Chart offset="20 -10 -40 40" axes={{x: {type: NumericAxis}, y: {type: NumericAxis, vertical: true}}}>
            <Gridlines/>
            <LineGraph data:bind="$page.line" colorIndex={8} yField="y2h" y0Field="y2l" active:bind="$page.line2"
               line={false} area/>
            <LineGraph name="Line 1" data:bind="$page.line" colorIndex={0} area active:bind="$page.line1"/>
            <LineGraph name="Line 2" data:bind="$page.line" colorIndex={8} yField="y2" active:bind="$page.line2"/>
         </Chart>
      </Svg>
      <Legend />
   </Legend.Scope>
</cx>