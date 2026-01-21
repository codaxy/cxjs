/** @jsxImportSource cx */
import { Svg } from "cx/svg";
import {
  Chart,
  NumericAxis,
  LineGraph,
  Legend,
  Gridlines,
  ColumnGraph,
} from "cx/charts";
import { Controller } from "cx/ui";

class DemoController extends Controller {
  onInit() {
    this.generateData();
  }

  generateData() {
    let v1 = 100,
      v2 = 80;
    this.store.set(
      "data",
      Array.from({ length: 12 }, (_, i) => ({
        month: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ][i],
        sales: (v1 = Math.max(
          50,
          Math.min(150, v1 + (Math.random() - 0.5) * 30),
        )),
        profit: (v2 = Math.max(
          30,
          Math.min(120, v2 + (Math.random() - 0.5) * 25),
        )),
      })),
    );
  }
}

export default () => (
  <cx>
    <div controller={DemoController} style="width: 100%;">
      <Legend />
      <Svg style="width: 100%; height: 220px;">
        <Chart
          margin="10 20 30 40"
          axes={{
            x: { type: NumericAxis, snapToTicks: 0 },
            y: { type: NumericAxis, vertical: true, snapToTicks: 1 },
          }}
        >
          <Gridlines />
          <LineGraph
            data-bind="data"
            colorIndex={0}
            yField="sales"
            name="Sales"
            area
            areaStyle="fill: rgba(39, 170, 225, 0.2);"
          />
          <LineGraph
            data-bind="data"
            colorIndex={4}
            yField="profit"
            name="Profit"
          />
        </Chart>
      </Svg>
    </div>
  </cx>
);
