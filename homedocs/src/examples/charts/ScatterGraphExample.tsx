/** @jsxImportSource cx */
import { Svg } from "cx/svg";
import { Chart, NumericAxis, Gridlines, ScatterGraph, Legend } from "cx/charts";
import { Controller } from "cx/ui";

class PageController extends Controller {
  onInit() {
    this.store.set(
      "data",
      Array.from({ length: 30 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 5 + Math.random() * 15,
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
          <ScatterGraph
            name="Points"
            data-bind="data"
            colorIndex={6}
            sizeField="size"
          />
        </Chart>
      </Svg>
    </div>
  </cx>
);
