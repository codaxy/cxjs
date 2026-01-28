import {
   Chart,
   Gridlines,
   Legend,
   LegendEntry,
   LineGraph,
   NumericAxis,
   MarkerLine,
   Marker,
   MouseTracker,
   PointReducer,
   MinMaxFinder,
   SnapPointFinder,
   ValueAtFinder,
   TimeAxis,
   CategoryAxis,
   ColumnGraph,
} from "cx/charts";
import { Line, Rectangle, Svg, Text } from "cx/svg";
import { computable, Controller, KeySelection, Repeater } from "cx/ui";
import { HtmlElement, enableTooltips } from "cx/widgets";

enableTooltips();

class PageController extends Controller {
   init() {
      super.init();
      var y1 = 150,
         y2 = 250;

      let d = new Date();
      this.store.set(
         "$page.points",
         Array.from({ length: 50 }, (_, i) => ({
            x: new Date(d.setDate(d.getDate() + 1)).toISOString(),
            y: i % 20 == 3 ? null : (y1 = y1 + (Math.random() - 0.5) * 30),
            y2: (y2 = y2 + (Math.random() - 0.5) * 30),
            y2l: y2 - 50,
            y2h: y2 + 50,
         })),
      );

      this.store.set("$page.chartData", [
         {
            value: 0,
            attr: "Apple",
            index: 0.3064,
         },
         {
            value: 1,
            attr: "Google",
            index: 0.0394,
         },
         {
            value: 2,
            attr: "Samsung",
            index: 0.0091,
         },
         {
            value: 3,
            attr: "",
            index: 0.007,
         },
      ]);
   }
}

export default (
   <cx>
      <div class="widgets" controller={PageController}>
         {/* <Svg style="width:600px; height:400px;">
            <Chart
               offset="20 -10 -40 40"
               axes={{
                  x: { type: TimeAxis, format: "d" },
                  y: { type: NumericAxis, vertical: true },
               }}
            >
               <MouseTracker
                  x:bind="tracker.x"
                  y:bind="tracker.y"
                  tooltip={{
                     trackMouse: true,
                     destroyDelay: 50,
                     createDelay: 5,
                     items: (
                        <cx>
                           <table>
                              <tbody>
                                 <tr>
                                    <td>
                                       <LegendEntry name="Line 1" text="Line 1" colorIndex={0} />
                                    </td>
                                    <td text:tpl="{tracker.line1y:n;2}" />
                                 </tr>
                                 <tr>
                                    <td>
                                       <LegendEntry name="Line 2" text="Line 2" colorIndex={8} />
                                    </td>
                                    <td text:tpl="{tracker.line2y:n;2}" />
                                 </tr>
                              </tbody>
                           </table>
                        </cx>
                     ),
                  }}
               >
                  <SnapPointFinder
                     cursorX:bind="tracker.x"
                     snapX:bind="tracker.snapX"
                     convertX={(x) => {
                        return x && new Date(x).getTime();
                     }}
                     // for this to work properly with TimeAxis we have to specify large enough maxDistance
                     maxDistance={Infinity}
                  >
                     <MinMaxFinder minY:bind="min" maxY:bind="max">
                        <Gridlines />

                        <LineGraph
                           data:bind="$page.points"
                           colorIndex={8}
                           yField="y2h"
                           y0Field="y2l"
                           active:bind="$page.line2"
                           line={false}
                           area
                        />

                        <ValueAtFinder
                           at:bind="tracker.snapX"
                           value:bind="tracker.line1y"
                           convert={(x) => {
                              return x && new Date(x).getTime();
                           }}
                        >
                           <LineGraph
                              name="Line 1"
                              data:bind="$page.points"
                              colorIndex={0}
                              area
                              active:bind="$page.line1"
                           />
                        </ValueAtFinder>
                        <ValueAtFinder
                           at:bind="tracker.snapX"
                           value:bind="tracker.line2y"
                           convert={(x) => {
                              return x && new Date(x).getTime();
                           }}
                        >
                           <LineGraph
                              name="Line 2"
                              data:bind="$page.points"
                              colorIndex={8}
                              yField="y2"
                              active:bind="$page.line2"
                           />
                        </ValueAtFinder>
                        <MarkerLine x:bind="tracker.snapX" />
                        <MarkerLine y:bind="tracker.y" />
                        <MarkerLine y:bind="max" />
                        <MarkerLine y:bind="min" />
                        <Marker x:bind="tracker.snapX" y:bind="tracker.line1y" colorIndex={0} size={10} />
                        <Marker x:bind="tracker.snapX" y:bind="tracker.line2y" colorIndex={8} size={10} />
                     </MinMaxFinder>
                  </SnapPointFinder>
               </MouseTracker>
            </Chart>
         </Svg>
         <Legend /> */}

         <Svg style="width:600px; height:400px;">
            <Chart
               offset="20 -40 -60 50"
               axes={{
                  x: {
                     type: NumericAxis,
                     tickSize: 0,
                     labelRotation: -30,
                     labelAnchor: "end",
                     // onCreateLabelFormatter: (context: any, instance: Instance) => {
                     // 	let i = 0;

                     // 	let map = instance.store.get($page.chartValuesMap);
                     // 	return (formattedValue: string, value: string) => {
                     // 		if (i++ % 2 == 1) return [];

                     // 		let text = map?.metro?.[value];
                     // 		return [{ text: `${text?.substring(0, 18)}...` }];
                     // 	};
                     // },
                     labelOffset: 5,
                  },
                  y: {
                     type: NumericAxis,
                     vertical: true,
                     format: "n;0;1",
                     minLabelDistance: 20,
                  },
               }}
            >
               <Gridlines xAxis={false} />

               <MouseTracker x-bind="chartInfo.cursor.x" y-bind="chartInfo.cursor.y">
                  <SnapPointFinder
                     cursorX-bind="chartInfo.cursor.x"
                     //cursorY-bind="chartInfo.cursor.y"
                     snapX-bind="chartInfo.snapX"
                     snapY-bind="chartInfo.index"
                     maxDistance={1000}
                  >
                     <ColumnGraph
                        // data={$widget.chart.data}
                        data-bind="$page.chartData"
                        name="feature"
                        // xField="attrNumber"
                        xField="value"
                        yField="index"
                        size={0.8}
                        //offset={-0.1}
                        colorIndex={4}
                        borderRadius={2}
                     />
                  </SnapPointFinder>

                  <Marker
                     x-bind="chartInfo.snapX"
                     y-bind="chartInfo.index"
                     size={10}
                     tooltip={{
                        alwaysVisible: true,
                        items: (
                           <cx>
                              <div class="flex gap-2">
                                 <div
                                    text={computable("chartInfo", (ci) => {
                                       return ci.snapX;
                                    })}
                                 ></div>
                                 {/* <div
                                    text={expr($page.chartValuesMap.metro, chartInfo.snapX, (map, x) => {
                                       return `${map[x]}:`;
                                    })}
                                 /> */}
                                 {/* <div
                                    class="font-semibold"
                                    text={expr(chartInfo.index, (i) => Format.value(i, "n;0;2"))}
                                 /> */}
                              </div>
                           </cx>
                        ),
                        placement: "up",
                        destroyDelay: 0,
                        createDelay: 0,
                     }}
                  />
               </MouseTracker>
            </Chart>
         </Svg>
      </div>
   </cx>
);
