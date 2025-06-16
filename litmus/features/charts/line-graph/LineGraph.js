import { Chart, Gridlines, Legend, LineGraph, Marker, NumericAxis } from "cx/charts";
import { Svg } from "cx/svg";
import { Controller, LabelsLeftLayout, Repeater } from "cx/ui";
import { PureContainer, Slider, Switch } from "cx/widgets";

class PageController extends Controller {
   onInit() {
      this.store.init("$page.pointsCount", 30);
      this.store.init("$page.showArea", true);
      this.store.init("$page.showLine", true);
      this.store.init("$page.smooth", true);
      this.store.init("$page.smoothingRatio", 0.1);

      this.addTrigger(
         "on-count-change",
         ["$page.pointsCount"],
         (cnt) => {
            let y1 = 150;
            let y2 = 350;
            const data = Array.from({ length: cnt }, (_, i) => ({
               x: i * 4,
               y: i % 20 == 3 ? null : (y1 = y1 + (Math.random() - 0.5) * 100),
               y2: (y2 = y2 + (Math.random() - 0.5) * 100),
               y2l: y2 - 50,
               y2h: y2 + 50,
            }));

            this.store.set("$page.points", data);
         },
         true,
      );
   }
}

export default (
   <cx>
      <div class="widgets" style="padding-left: 30px; width: 45%" controller={PageController}>
         <Legend />
         <Svg style="width:800px; height:520px;">
            <Chart
               offset="20 -10 -40 40"
               axes={{
                  x: { type: NumericAxis, lineStyle: "stroke: transparent" },
                  y: { type: NumericAxis, vertical: true },
               }}
            >
               <Gridlines />
               <LineGraph
                  data-bind="$page.points"
                  colorIndex={8}
                  yField="y2h"
                  y0Field="y2l"
                  active-bind="$page.line1"
                  area-bind="$page.showArea"
                  line={false}
                  smooth-bind="$page.smooth"
                  smoothingRatio-bind="$page.smoothingRatio"
                  name="Line 1"
               />
               <LineGraph
                  data-bind="$page.points"
                  colorIndex={8}
                  yField="y2"
                  active-bind="$page.line1"
                  line
                  visible-bind="$page.showLine"
                  smooth-bind="$page.smooth"
                  smoothingRatio-bind="$page.smoothingRatio"
                  name="Line 1"
               />

               <LineGraph
                  data-bind="$page.points"
                  colorIndex={0}
                  active-bind="$page.line2"
                  area-bind="$page.showArea"
                  line-bind="$page.showLine"
                  smooth-bind="$page.smooth"
                  smoothingRatio-bind="$page.smoothingRatio"
                  name="Line 2"
               />
               <PureContainer visible-bind="$page.showMarkers">
                  <Repeater records-bind="$page.points">
                     <Marker x-bind="$record.x" y-bind="$record.y2" size={4} shape="circle" colorIndex={8} />
                  </Repeater>
                  <Repeater records-bind="$page.points">
                     <Marker x-bind="$record.x" y-bind="$record.y" size={4} shape="circle" colorIndex={0} />
                  </Repeater>
               </PureContainer>
            </Chart>
         </Svg>

         <div
            style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px; width: 400px"
            layout={{ type: LabelsLeftLayout, columns: 2 }}
         >
            <Slider
               label="Points count"
               maxValue={200}
               minValue={1}
               step={1}
               value={{ bind: "$page.pointsCount", debounce: 150 }}
               help-tpl="{$page.pointsCount} points"
            />

            <Switch label="Area" value-bind="$page.showArea" />
            <Switch label="Line" value-bind="$page.showLine" />

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
            <Switch label="Show markers" value-bind="$page.showMarkers" />
         </div>
      </div>
   </cx>
);
