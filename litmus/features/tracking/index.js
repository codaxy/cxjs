import {
   Chart,
   Gridlines,
   Legend,
   LineGraph,
   NumericAxis,
   MarkerLine
} from "cx/charts";
import {Line, Rectangle, Svg, Text} from "cx/svg";
import {Controller, KeySelection, Repeater} from "cx/ui";
import {HtmlElement, enableTooltips} from "cx/widgets";
import {XYTracker} from "./XYTracker";
import {LineTracker} from "./LineTracker";

enableTooltips();

class PageController extends Controller {
   init() {
      super.init();
      var y1 = 150, y2 = 250;
      this.store.set(
         "$page.points",
         Array.from({length: 101}, (_, i) => ({
            x: i * 4,
            y: i % 20 == 3 ? null : y1 = y1 + (Math.random() - 0.5) * 30,
            y2: y2 = y2 + (Math.random() - 0.5) * 30,
            y2l: y2 - 50,
            y2h: y2 + 50
         }))
      );
   }
}

export default (
   <cx>
      <div class="widgets" controller={PageController}>
         <Svg style="width:600px; height:400px;">
            <Chart
               offset="20 -10 -40 40"
               axes={
                  {
                     x: {type: NumericAxis},
                     y: {type: NumericAxis, vertical: true}
                  }
               }
            >
               <XYTracker
                  x:bind="tracker.x"
                  y:bind="tracker.y"
                  tooltip={{
                     text: {tpl: '{tracker.x:n;2}, {tracker.y:n;2}'},
                     trackMouse: true
                  }}
               >
                  <LineTracker
                     onPrepareAccumulator={(acc) => {
                        acc.x = [];
                     }}
                     onCollect={(acc, x, y, name) => {
                        acc.x.push(x);
                        if (y != null && acc.max == null || acc.max < y)
                           acc.max = y;
                        if (y != null && acc.min == null || acc.min > y)
                           acc.min = y;
                     }}
                     onWrite={(acc, {store}) => {
                        console.log(acc);
                        store.set('max', acc.max);
                        store.set('min', acc.min);
                     }}
                  >
                     <Gridlines/>
                     <LineGraph
                        data:bind="$page.points"
                        colorIndex={8}
                        yField="y2h"
                        y0Field="y2l"
                        active:bind="$page.line2"
                        line={false}
                        area
                     />
                     <LineGraph
                        name="Line 1"
                        data:bind="$page.points"
                        colorIndex={0}
                        area
                        active:bind="$page.line1"
                     />
                     <LineGraph
                        name="Line 2"
                        data:bind="$page.points"
                        colorIndex={8}
                        yField="y2"
                        active:bind="$page.line2"
                     />
                     <MarkerLine x:bind="tracker.x"/>
                     <MarkerLine
                        y:bind="tracker.y"
                     />
                     <MarkerLine
                        y:bind="max"
                     />
                     <MarkerLine
                        y:bind="min"
                     />
                  </LineTracker>
               </XYTracker>

            </Chart>
         </Svg>
         <Legend/>
      </div>
   </cx>
);
