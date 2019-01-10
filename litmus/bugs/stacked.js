import { HtmlElement, Repeater, Section } from "cx/widgets";
import { Svg } from "cx/svg";
import {
   Chart,
   ColorMap,
   Gridlines,
   Legend,
   LineGraph,
   NumericAxis,
   TimeAxis
} from "cx/charts";

const day = 24 * 60 * 60 * 1000;
let startDate = Date.now() - 30 * day;
let categories = ["New", "Open", "Fixed", "Verified"];
let series = [];

for (let cat of categories) {
   let points = [];

   let v = Math.round(10 * Math.random());

   for (let i = 0; i < 30; i++) {
      v += Math.round(2 * (Math.random() - 0.5));
      if (v < 0) v = 0;
      points.push({
         date: startDate + i * day,
         count: v
      });
   }

   series.push({
      category: cat,
      data: points
   });
}

export default (
   <cx>
      <Section
         title="Issues Trend"
         bodyStyle="padding: 5px; display: flex; flex-direction: column; height: 500px"
      >
         <Legend.Scope>
            <Svg style="flex: 1">
               <Chart
                  margin="10 10 25 30"
                  axes={{
                     x: {
                        type: TimeAxis,
                        snapToTicks: false
                     },
                     y: {
                        type: NumericAxis,
                        vertical: true
                     }
                  }}
               >
                  <Gridlines />

                  <ColorMap />

                  <Repeater records={series}>
                     <LineGraph
                        data-bind="$record.data"
                        name-bind="$record.category"
                        colorMap="default"
                        xField="date"
                        yField="count"
                        stacked
                        area
                     />
                  </Repeater>
               </Chart>
            </Svg>
            <Legend mod="compact" />
         </Legend.Scope>
      </Section>
   </cx>
);
