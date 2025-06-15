import { Chart, Gridlines, Legend, LineGraph, NumericAxis, TimeAxis } from "cx/charts";
import { Svg } from "cx/svg";
import { Controller } from "cx/ui";
import { chartData } from "./data";
import { Switch } from "cx/widgets";

class PageController extends Controller {
   onInit() {
      this.store.set("$page.chartData.data", chartData);
   }
}

export default (
   <cx>
      <div class="widgets" style="padding-left: 30px; width: 45%" controller={PageController}>
         <Switch value-bind="$page.area2" label="show Y2 area" />
         <Svg style="height: 450px">
            <Chart
               offset="40 -55 -30 60"
               axes={{
                  x: (
                     <cx>
                        <TimeAxis
                           tickSize={0}
                           minTickUnit="week"
                           format="datetime;MMMdd"
                           labelDx={-18}
                           snapToTicks={false}
                           hideLine
                        />
                     </cx>
                  ),
                  y: (
                     <cx>
                        <NumericAxis vertical format="n;0;0;c" minLabelTickSize={1} hideLine />
                     </cx>
                  ),
                  y2: (
                     <cx>
                        <NumericAxis vertical secondary format="n;0;0;c" />
                     </cx>
                  ),
               }}
            >
               <Gridlines xAxis={false} />
               <LineGraph
                  name="Revenue"
                  data-bind={"$page.chartData.data"}
                  colorIndex={12}
                  xField="date"
                  yField="metricValue"
                  smooth
                  smoothingRatio={0.07}
                  area
               />

               <LineGraph
                  name="Cost"
                  data-bind={"$page.chartData.data"}
                  colorIndex={6}
                  xField="date"
                  yField="cost"
                  yAxis="y2"
                  smooth
                  smoothingRatio={0.07}
                  area-bind="$page.area2"
               />
            </Chart>
         </Svg>
         <Legend />
      </div>
   </cx>
);
