import { Chart, Gridlines, Legend, LineGraph, Marker, NumericAxis } from "cx/charts";
import { Svg } from "cx/svg";
import { Controller, LabelsLeftLayout, Repeater } from "cx/ui";
import { PureContainer, Slider, Switch } from "cx/widgets";

class PageController extends Controller {
   onInit() {
      this.store.init("$page.pointsCount", 30);
      this.store.init("$page.smoothingRatio", 0.05);

      let y1 = 250;
      let y2 = 350;
      this.addTrigger(
         "on-count-change",
         ["$page.pointsCount"],
         (cnt) => {
            const data = Array.from({ length: cnt }, (_, i) => ({
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

            console.log("points:", data);
            console.log("points2:", smoothed);
            console.log("points3:", smoothed2);
         },
         true,
      );
   }
}

export default (
   <cx>
      <div class="widgets" style="padding: 50px" controller={PageController}>
         <div
            style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px; width: 400px"
            layout={{ type: LabelsLeftLayout, columns: 2 }}
         >
            <Slider
               label="Points count"
               maxValue={500}
               minValue={1}
               step={1}
               value={{ bind: "$page.pointsCount", debounce: 150 }}
               help-tpl="{$page.pointsCount} points"
            />

            <Switch label="Show markers" value-bind="$page.showMarkers" />
            <Switch label="Smooth" value-bind="$page.smooth" />
            <Slider
               label="Smoothing ratio"
               enabled-bind="$page.smooth"
               value={{ bind: "$page.smoothingRatio", debounce: 100 }}
               maxValue={0.4}
               minValue={0}
               step={0.01}
               help-tpl="{$page.smoothingRatio:n;0;2}"
            />
         </div>

         <Svg style="width:800px; height:600px;">
            <Chart
               offset="20 -10 -40 40"
               axes={{
                  x: { type: NumericAxis, lineStyle: "stroke: transparent" },
                  y: { type: NumericAxis, vertical: true },
               }}
            >
               <Gridlines />
               <LineGraph
                  name="Line 1"
                  yField="y2"
                  data-bind="$page.points"
                  colorIndex={8}
                  //area
                  active-bind="$page.line1"
                  smooth-bind="$page.smooth"
                  smoothingRatio-bind="$page.smoothingRatio"
               />
               <LineGraph
                  name="Line 2"
                  data-bind="$page.points2"
                  colorIndex={0}
                  smooth-bind="$page.smooth"
                  smoothingRatio-bind="$page.smoothingRatio"
                  active-bind="$page.line2"
               />
               <LineGraph
                  name="Line 3"
                  data-bind="$page.points3"
                  colorIndex={12}
                  smooth-bind="$page.smooth"
                  smoothingRatio-bind="$page.smoothingRatio"
                  active-bind="$page.line3"
               />
               <LineGraph
                  data-bind="$page.points"
                  colorIndex={8}
                  yField="y2h"
                  y0Field="y2l"
                  active-bind="$page.line1"
                  line={false}
                  area
                  smooth-bind="$page.smooth"
                  smoothingRatio-bind="$page.smoothingRatio"
               />
               <PureContainer visible-bind="$page.showMarkers">
                  <Repeater records-bind="$page.points">
                     <Marker x-bind="$record.x" y-bind="$record.y2" size={5} shape="circle" colorIndex={8} />
                  </Repeater>
                  <Repeater records-bind="$page.points2">
                     <Marker x-bind="$record.x" y-bind="$record.y" size={5} shape="circle" colorIndex={0} />
                  </Repeater>
                  <Repeater records-bind="$page.points3">
                     <Marker x-bind="$record.x" y-bind="$record.y" size={5} shape="circle" colorIndex={12} />
                  </Repeater>
               </PureContainer>
            </Chart>
         </Svg>
         <Legend />
      </div>
   </cx>
);
