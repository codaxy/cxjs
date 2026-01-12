/** @jsxImportSource cx */
import { Svg } from "cx/svg";
import { Chart, NumericAxis, Gridlines, LineGraph, Legend } from "cx/charts";
import { Controller } from "cx/ui";

class PageController extends Controller {
  onInit() {
    this.store.set(
      "data",
      Array.from({ length: 15 }, (_, i) => ({
        x: i * 10,
        sales: 50 + Math.random() * 50,
        profit: 30 + Math.random() * 40,
        costs: 20 + Math.random() * 30,
      })),
    );
  }
}

export default () => (
  <cx>
    <div controller={PageController}>
      <Legend />
      <Svg style="width: 100%; height: 250px;">
        <Chart
          margin="20 20 40 50"
          axes={{
            x: { type: NumericAxis },
            y: { type: NumericAxis, vertical: true },
          }}
        >
          <Gridlines />
          <LineGraph
            name="Sales"
            data-bind="data"
            colorIndex={0}
            yField="sales"
          />
          <LineGraph
            name="Profit"
            data-bind="data"
            colorIndex={4}
            yField="profit"
          />
          <LineGraph
            name="Costs"
            data-bind="data"
            colorIndex={8}
            yField="costs"
          />
        </Chart>
      </Svg>
    </div>
  </cx>
);
