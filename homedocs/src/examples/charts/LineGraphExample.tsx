/** @jsxImportSource cx */
import { Svg } from "cx/svg";
import { Chart, NumericAxis, Gridlines, LineGraph, Legend } from "cx/charts";
import { Controller } from "cx/ui";

class PageController extends Controller {
  onInit() {
    this.store.set(
      "points",
      Array.from({ length: 20 }, (_, i) => ({
        x: i * 5,
        y: 100 + Math.sin(i * 0.5) * 50 + Math.random() * 20,
        y2: 150 + Math.cos(i * 0.3) * 40 + Math.random() * 20,
      })),
    );
  }
}

export default () => (
  <cx>
    <div controller={PageController}>
      <Legend />
      <Svg style="width: 100%; height: 300px;">
        <Chart
          margin="20 20 40 50"
          axes={{
            x: { type: NumericAxis },
            y: { type: NumericAxis, vertical: true },
          }}
        >
          <Gridlines />
          <LineGraph name="Series 1" data-bind="points" colorIndex={0} area />
          <LineGraph
            name="Series 2"
            data-bind="points"
            colorIndex={4}
            yField="y2"
          />
        </Chart>
      </Svg>
    </div>
  </cx>
);
