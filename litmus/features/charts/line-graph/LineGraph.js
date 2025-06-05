import { Chart, Gridlines, Legend, LineGraph, Marker, MarkerLine, NumericAxis, PointReducer } from "cx/charts";
import { Svg, Text } from "cx/svg";
import { Controller, Repeater } from "cx/ui";
import { Slider } from "cx/widgets";

class PageController extends Controller {
   onInit() {
      var y1 = 250,
         y2 = 350;

      const data = Array.from({ length: 100 }, (_, i) => ({
         x: i * 4,
         y: i % 20 == 3 ? null : (y1 = y1 + (Math.random() - 0.5) * 100),
         y2: (y2 = y2 + (Math.random() - 0.5) * 100),
         y2l: y2 - 50,
         y2h: y2 + 50,
      }));

      this.store.set("$page.points", data);

      const smoothed = data.map((p) => ({
         x: p.x,
         y: p.y != null ? p.y + 100 : null,
      }));

      const smoothed2 = smoothed.filter((s) => s.y != null).map((s) => ({ ...s, y: s.y + 100 }));

      this.store.set("$page.points2", smoothed);
      this.store.set("$page.points3", smoothed2);
   }
}

export default (
   <cx>
      <div class="widgets" style="padding: 100px" controller={PageController}>
         <Svg style="width:800px; height:600px;">
            <Chart
               offset="20 -10 -40 40"
               axes={{
                  x: { type: NumericAxis, lineStyle: "stroke: transparent" },
                  y: { type: NumericAxis, vertical: true },
               }}
            >
               <Gridlines />
               <LineGraph name="Line 1" data-bind="$page.points" colorIndex={0} area active-bind="$page.line1" smooth />
               <LineGraph name="Line 2" data-bind="$page.points2" colorIndex={8} smooth />
               <LineGraph name="Line 3" data-bind="$page.points3" colorIndex={12} smooth />
            </Chart>
         </Svg>
         <Legend />
      </div>
   </cx>
);
