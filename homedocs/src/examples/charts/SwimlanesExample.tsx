/** @jsxImportSource cx */
import { Svg } from "cx/svg";
import {
  Chart,
  NumericAxis,
  CategoryAxis,
  Swimlanes,
  BarGraph,
  Legend,
} from "cx/charts";
import { Controller } from "cx/ui";

class PageController extends Controller {
  onInit() {
    this.store.set("data", [
      { category: "Product A", sales: 120, returns: 85 },
      { category: "Product B", sales: 95, returns: 140 },
      { category: "Product C", sales: 165, returns: 110 },
      { category: "Product D", sales: 75, returns: 125 },
      { category: "Product E", sales: 145, returns: 95 },
    ]);
  }
}

export default () => (
  <cx>
    <div controller={PageController}>
      <Legend />
      <Svg style="width: 100%; height: 280px;">
        <Chart
          margin="20 20 40 100"
          axes={{
            x: { type: NumericAxis, snapToTicks: 1 },
            y: { type: CategoryAxis, vertical: true },
          }}
        >
          <Swimlanes size={0.8} step={1} />
          <BarGraph
            data-bind="data"
            colorIndex={0}
            name="2023"
            size={0.35}
            offset={-0.17}
            xField="sales"
          />
          <BarGraph
            data-bind="data"
            colorIndex={4}
            name="2024"
            size={0.35}
            offset={0.17}
            xField="returns"
          />
        </Chart>
      </Svg>
    </div>
  </cx>
);
