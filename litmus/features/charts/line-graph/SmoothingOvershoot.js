import { Chart, Gridlines, LineGraph, Marker, MarkerLine, NumericAxis } from "cx/charts";
import { Svg } from "cx/svg";
import { Controller, LabelsLeftLayout, Repeater } from "cx/ui";
import { Select, Switch } from "cx/widgets";

// Verifies that smooth line rendering (monotone cubic interpolation) never
// overshoots the actual data range, i.e. the curve stays within the vertical
// bounds of the data. Most sensitive datasets are those with steep slopes next
// to flat segments (steps, spikes, zeros).

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
      this.store.init("$page.showArea", false);
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
         <Svg style="width:560px; height:500px;">
            <Chart
               offset="100 -10 -100 50"
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
               />
               <MarkerLine
                  y-bind="$page.yMin"
                  visible-bind="$page.showBounds"
                  style="stroke: red; stroke-dasharray: 4 4"
               />

               <LineGraph
                  data-bind="$page.points"
                  lineStyle="stroke: #0074eb; stroke-width: 2.5"
                  areaStyle="fill: rgba(0, 116, 235, 0.15)"
                  area-bind="$page.showArea"
                  smooth-bind="$page.smooth"
                  legend={false}
               />
               <LineGraph
                  data-bind="$page.points"
                  visible-bind="$page.showRawLine"
                  lineStyle="stroke: #333; stroke-dasharray: 3 3; stroke-width: 1.5"
                  legend={false}
               />

               <Repeater records-bind="$page.points">
                  <Marker
                     visible-bind="$page.showMarkers"
                     x-bind="$record.x"
                     y-bind="$record.y"
                     size={5}
                     shape="circle"
                     style="fill: #333; stroke: #333"
                     legend={false}
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
            <Switch label="Area" value-bind="$page.showArea" />
            <Switch label="Show actual data (dashed)" value-bind="$page.showRawLine" />
            <Switch label="Show markers" value-bind="$page.showMarkers" />
            <Switch label="Show data min/max bounds" value-bind="$page.showBounds" />
         </div>

         <div style="margin-top: 20px; max-width: 700px; color: #666">
            <p>
               The smoothed curve should never cross the dashed red lines — those mark the actual minimum and maximum
               of the data. Smoothing is based on monotone cubic interpolation, which stays within the data bounds, so
               the graph never suggests values that don't exist in the data.
            </p>
         </div>
      </div>
   </cx>
);
