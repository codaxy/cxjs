import { Chart, Gridlines, Legend, LineGraph, Marker, MarkerLine, NumericAxis } from "cx/charts";
import { Svg } from "cx/svg";
import { Controller, LabelsLeftLayout, Repeater } from "cx/ui";
import { Select, Slider, Switch } from "cx/widgets";

// Showcases how bezier-based smoothing overshoots the actual data range.
// The smoothed curve dips below the minimum / rises above the maximum of the data,
// which makes it look like the underlying values are incorrect.
// Most visible with steep slopes next to flat segments (steps, spikes, zeros).

const datasets = {
   step: {
      label: "Step (flat → jump → flat)",
      points: [0, 0, 0, 0, 0, 100, 100, 100, 100, 100].map((y, i) => ({ x: i * 10, y })),
   },
   spike: {
      label: "Single spike",
      points: [10, 10, 10, 10, 200, 10, 10, 10, 10].map((y, i) => ({ x: i * 10, y })),
   },
   zeros: {
      label: "Sparse data with zeros",
      points: [0, 0, 45, 0, 0, 0, 120, 80, 0, 0, 30, 0].map((y, i) => ({ x: i * 10, y })),
   },
   plateau: {
      label: "Plateaus with steep transitions",
      points: [10, 12, 11, 13, 200, 210, 205, 208, 12, 10, 11].map((y, i) => ({ x: i * 10, y })),
   },
   unevenX: {
      label: "Uneven x spacing + steep slope",
      points: [
         { x: 0, y: 20 },
         { x: 5, y: 22 },
         { x: 10, y: 21 },
         { x: 12, y: 180 },
         { x: 60, y: 185 },
         { x: 62, y: 20 },
         { x: 100, y: 22 },
      ],
   },
};

class PageController extends Controller {
   onInit() {
      this.store.init("$page.dataset", "step");
      this.store.init("$page.smooth", true);
      this.store.init("$page.smoothingRatio", 0.4);
      this.store.init("$page.showRawLine", true);
      this.store.init("$page.showMarkers", true);
      this.store.init("$page.showBounds", true);

      this.addTrigger(
         "on-dataset-change",
         ["$page.dataset"],
         (name) => {
            const points = datasets[name].points;
            this.store.set("$page.points", points);
            this.store.set("$page.yMin", Math.min(...points.map((p) => p.y)));
            this.store.set("$page.yMax", Math.max(...points.map((p) => p.y)));
         },
         true,
      );
   }
}

export default (
   <cx>
      <div class="widgets" style="padding-left: 30px" controller={PageController}>
         <Legend />
         <Svg style="width:900px; height:550px;">
            <Chart
               offset="20 -10 -40 50"
               axes={{
                  x: { type: NumericAxis, lineStyle: "stroke: transparent" },
                  y: { type: NumericAxis, vertical: true },
               }}
            >
               <Gridlines />

               <MarkerLine
                  y-bind="$page.yMax"
                  visible-bind="$page.showBounds"
                  style="stroke: red; stroke-dasharray: 4 4"
                  name="Data bounds"
               />
               <MarkerLine
                  y-bind="$page.yMin"
                  visible-bind="$page.showBounds"
                  style="stroke: red; stroke-dasharray: 4 4"
               />

               <LineGraph
                  data-bind="$page.points"
                  colorIndex={0}
                  smooth-bind="$page.smooth"
                  smoothingRatio-bind="$page.smoothingRatio"
                  name="Smoothed"
               />
               <LineGraph
                  data-bind="$page.points"
                  colorIndex={8}
                  visible-bind="$page.showRawLine"
                  lineStyle="stroke-dasharray: 2 3; stroke-width: 1"
                  name="Actual data"
               />

               <Repeater records-bind="$page.points">
                  <Marker
                     visible-bind="$page.showMarkers"
                     x-bind="$record.x"
                     y-bind="$record.y"
                     size={5}
                     shape="circle"
                     colorIndex={8}
                  />
               </Repeater>
            </Chart>
         </Svg>

         <div
            style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px; width: 500px"
            layout={LabelsLeftLayout}
         >
            <Select label="Dataset" value-bind="$page.dataset">
               <option value="step" text={datasets.step.label} />
               <option value="spike" text={datasets.spike.label} />
               <option value="zeros" text={datasets.zeros.label} />
               <option value="plateau" text={datasets.plateau.label} />
               <option value="unevenX" text={datasets.unevenX.label} />
            </Select>

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
            <Switch label="Show actual data (dashed)" value-bind="$page.showRawLine" />
            <Switch label="Show markers" value-bind="$page.showMarkers" />
            <Switch label="Show data min/max bounds" value-bind="$page.showBounds" />
         </div>

         <div style="margin-top: 20px; max-width: 700px; color: #666">
            <p>
               The smoothed curve should never cross the dashed red lines — those mark the actual minimum and maximum
               of the data. With the current bezier smoothing, steep slopes next to flat segments push the curve
               outside the data range (overshoot), so the graph appears to show values that don't exist in the data
               (e.g. negative values where the data has zeros).
            </p>
         </div>
      </div>
   </cx>
);
