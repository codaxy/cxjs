import {
   CategoryAxis,
   Chart,
   Gridlines,
   Marker,
   MouseTracker,
   NumericAxis,
   ScatterGraph,
   SnapPointFinder,
} from "cx/charts";
import { Svg } from "cx/svg";
import { computable, Controller } from "cx/ui";
import { enableTooltips } from "cx/widgets";

enableTooltips();

class PageController extends Controller {
   init() {
      super.init();

      this.store.set("$page.chartData", [
         {
            category: "Sunday",
            actual: 6387.1685,
            predicted: 53.7107,
         },
         {
            category: "Saturday",
            actual: 1700.2393,
            predicted: 53.6998,
         },
         {
            category: "Thursday",
            actual: 1496.0355,
            predicted: 63.1824,
         },
         {
            category: "Friday",
            actual: 388.6653,
            predicted: 49.6263,
         },
         {
            category: "Wednesday",
            actual: 283.533,
            predicted: 54.5586,
         },
         {
            category: "Monday",
            actual: 48.9441,
            predicted: 52.2343,
         },
         {
            category: "Tuesday",
            actual: 16.3296,
            predicted: 53.2486,
         },
      ]);
   }
}

export default (
   <cx>
      <div class="widgets" controller={PageController}>
         <Svg style="width:400px; height:400px;">
            <Chart
               offset="20 -40 -60 90"
               axes={{
                  x: {
                     type: CategoryAxis,
                     tickSize: 0,
                     //  onCreateLabelFormatter: (context, instance) => {
                     //     let i = 0;

                     //     return (formattedValue, value) => {
                     //        if (i++ % 2 == 1) return [{}, { text: value }];
                     //        return [{ text: value }];
                     //     };
                     //  },
                     labelOffset: 5,
                     alternateLabelOffset: 22,
                  },
                  y: {
                     type: NumericAxis,
                     vertical: true,
                     format: "n;0;1",
                     alternateLabelOffset: 40,
                  },
               }}
            >
               <Gridlines xAxis={false} />

               <MouseTracker x-bind="chartInfo.cursor.x" y-bind="chartInfo.cursor.y">
                  <SnapPointFinder
                     cursorX-bind="chartInfo.cursor.x"
                     //cursorY-bind="chartInfo.cursor.y"
                     snapRecord-bind="chartInfo.rec"
                     snapX-bind="chartInfo.snapX"
                     snapY-bind="chartInfo.index"
                     maxDistance={1000}
                  >
                     <ScatterGraph
                        data-bind="$page.chartData"
                        name="feature"
                        xField="predicted"
                        yField="actual"
                        size={8}
                        colorIndex={6}
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
                              <div style="display: flex; flex-direction: column; gap: 4px">
                                 <div text-bind="chartInfo.rec.category" style="font-weight: 600" />
                                 <div style="display: flex; flex-direction: column;">
                                    <div text-tpl="Actual: {chartInfo.rec.actual}" />
                                    <div text-tpl="Predicted: {chartInfo.rec.predicted}" />
                                 </div>
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
