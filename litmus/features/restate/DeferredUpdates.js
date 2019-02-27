import {Controller, Repeater, Restate} from "cx/ui";
import {Svg} from "cx/svg";
import {Chart, Gridlines, LineGraph, Legend, NumericAxis} from "cx/charts";
import {TextField} from "cx/widgets";

class PageController extends Controller {
   onInit() {
      var y1 = 150, y2 = 250;
      this.store.set('$page.points', Array.from({length: 101}, (_, i) => ({
         x: i * 4,
         y: i % 20 == 3 ? null : (y1 = (y1 + (Math.random() - 0.5) * 30)),
         y2: y2 = (y2 + (Math.random() - 0.5) * 30),
         y2l: y2 - 50,
         y2h: y2 + 50
      })));
   }
}

const LineChart = () => <cx>
   <Restate
      detached
      deferredUntilIdle
      data={{
         test: {bind: "test"}
      }}
   >
      <div controller={PageController}>
         <strong text-tpl="{test}"/>
         <Svg style="width:300px; height:200px;">
            <Chart offset="20 -10 -40 40" axes={{x: {type: NumericAxis}, y: {type: NumericAxis, vertical: true}}}>
               <Gridlines/>
               <LineGraph data:bind="$page.points" colorIndex={8} yField="y2h" y0Field="y2l" active:bind="$page.line2"
                          line={false} area/>
               <LineGraph name="Line 1" data:bind="$page.points" colorIndex={0} area active:bind="$page.line1"/>
               <LineGraph name="Line 2" data:bind="$page.points" colorIndex={8} yField="y2" active:bind="$page.line2"/>
            </Chart>
         </Svg>
         <Legend/>
      </div>
   </Restate>
</cx>

export default <cx>
   <div>
      <TextField value-bind="test"/>
      <TextField value-bind="test"/>
      <div style="display: flex; flex-wrap: wrap">
         <Repeater records={Array.from({length: 200}, () => ({}))}>
            <LineChart/>
         </Repeater>
      </div>
   </div>
</cx>