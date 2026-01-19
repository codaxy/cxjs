/** @jsxImportSource cx */
import { Svg } from "cx/svg";
import {
  Chart,
  NumericAxis,
  CategoryAxis,
  Gridlines,
  ColumnGraph,
  Legend,
} from "cx/charts";
import { Controller } from "cx/ui";

class PageController extends Controller {
  onInit() {
    this.store.set("data", [
      { month: "Jan", sales: 42 },
      { month: "Feb", sales: 58 },
      { month: "Mar", sales: 65 },
      { month: "Apr", sales: 71 },
      { month: "May", sales: 85 },
      { month: "Jun", sales: 78 },
    ]);
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
            x: { type: CategoryAxis },
            y: { type: NumericAxis, vertical: true },
          }}
        >
          <Gridlines />
          <ColumnGraph
            name="Sales"
            data-bind="data"
            colorIndex={2}
            xField="month"
            yField="sales"
            size={0.6}
          />
        </Chart>
      </Svg>
    </div>
  </cx>
);
