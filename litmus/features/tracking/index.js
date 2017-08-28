import {
   Chart,
   Gridlines,
   Legend,
   LegendEntry,
   LineGraph,
   NumericAxis,
   MarkerLine,
   Marker
} from "cx/charts";
import {Line, Rectangle, Svg, Text} from "cx/svg";
import {Controller, KeySelection, Repeater} from "cx/ui";
import {HtmlElement, enableTooltips} from "cx/widgets";
import {XYTracker} from "./XYTracker";
import {LineTracker} from "./LineTracker";
import {ValueAtTracker} from "./ValueAtTracker";
import {PointSnapTracker} from "./PointSnapTracker";

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
                     trackMouse: true,
                     destroyDelay: 50,
                     createDelay: 5,
                     items: <cx>
                        <table>
                           <tbody>
                           <tr>
                              <td>
                                 <LegendEntry name="Line 1" text="Line 1" colorIndex={0}/>
                              </td>
                              <td text:tpl="{tracker.line1y:n;2}"/>


                           </tr>
                           <tr>
                              <td>
                                 <LegendEntry name="Line 2" text="Line 2" colorIndex={8}/>
                              </td>
                              <td text:tpl="{tracker.line2y:n;2}"/>
                           </tr>
                           </tbody>
                        </table>
                     </cx>
                  }}
               >
                  <PointSnapTracker targetX:bind="tracker.x" x:bind="tracker.snapX">
                     <LineTracker
                        onPrepareAccumulator={(acc) => {
                           acc.x = [];
                           acc.max = null;
                           acc.min = null;
                        }}
                        onCollect={(acc, x, y, name) => {
                           acc.x.push(x);
                           if (y != null && (acc.max == null || acc.max < y))
                              acc.max = y;
                           if (y != null && (acc.min == null || acc.min > y))
                              acc.min = y;
                        }}
                        onWrite={(acc, {store}) => {
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

                        <ValueAtTracker x:bind="tracker.snapX" y:bind="tracker.line1y">
                           <LineGraph
                              name="Line 1"
                              data:bind="$page.points"
                              colorIndex={0}
                              area
                              active:bind="$page.line1"
                           />
                        </ValueAtTracker>
                        <ValueAtTracker x:bind="tracker.snapX" y:bind="tracker.line2y">
                           <LineGraph
                              name="Line 2"
                              data:bind="$page.points"
                              colorIndex={8}
                              yField="y2"
                              active:bind="$page.line2"
                           />
                        </ValueAtTracker>
                        {/*<MarkerLine x:bind="tracker.x"/>*/}
                        <MarkerLine x:bind="tracker.snapX"/>
                        <MarkerLine
                           y:bind="tracker.y"
                        />
                        <MarkerLine
                           y:bind="max"
                        />
                        <MarkerLine
                           y:bind="min"
                        />
                        <Marker x:bind="tracker.snapX" y:bind="tracker.line1y" colorIndex={0} size={10}/>
                        <Marker x:bind="tracker.snapX" y:bind="tracker.line2y" colorIndex={8} size={10}/>
                     </LineTracker>
                  </PointSnapTracker>
               </XYTracker>

            </Chart>
         </Svg>
         <Legend/>
      </div>
   </cx>
);
