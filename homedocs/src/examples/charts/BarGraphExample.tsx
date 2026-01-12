/** @jsxImportSource cx */
import { Svg } from "cx/svg";
import {
  Chart,
  NumericAxis,
  CategoryAxis,
  Gridlines,
  BarGraph,
  Legend,
} from "cx/charts";
import { Controller } from "cx/ui";

class PageController extends Controller {
  onInit() {
    this.store.set("data", [
      { city: "New York", value: 85 },
      { city: "London", value: 72 },
      { city: "Paris", value: 65 },
      { city: "Tokyo", value: 90 },
      { city: "Sydney", value: 58 },
    ]);
  }
}

export default () => (
  <cx>
    <div controller={PageController}>
      <Legend />
      <Svg style="width: 100%; height: 300px;">
        <Chart
          margin="20 20 40 80"
          axes={{
            x: { type: NumericAxis },
            y: { type: CategoryAxis, vertical: true },
          }}
        >
          <Gridlines />
          <BarGraph
            name="Score"
            data-bind="data"
            colorIndex={0}
            xField="value"
            yField="city"
            size={0.6}
          />
        </Chart>
      </Svg>
    </div>
  </cx>
);
