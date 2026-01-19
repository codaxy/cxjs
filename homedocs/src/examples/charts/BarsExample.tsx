/** @jsxImportSource cx */
import { Svg } from "cx/svg";
import {
  Chart,
  NumericAxis,
  CategoryAxis,
  Gridlines,
  Bar,
  Legend,
} from "cx/charts";
import { Repeater, Controller } from "cx/ui";

class PageController extends Controller {
  onInit() {
    this.store.set("data", [
      { category: "Product A", v1: 120, v2: 80 },
      { category: "Product B", v1: 90, v2: 150 },
      { category: "Product C", v1: 180, v2: 100 },
      { category: "Product D", v1: 60, v2: 130 },
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
            x: { type: NumericAxis },
            y: { type: CategoryAxis, vertical: true },
          }}
        >
          <Gridlines />
          <Repeater records-bind="data" recordAlias="$point">
            <Bar
              colorIndex={0}
              name="2023"
              height={0.3}
              offset={-0.15}
              x-bind="$point.v1"
              y-bind="$point.category"
              tooltip-tpl="{$point.v1}"
            />
            <Bar
              colorIndex={4}
              name="2024"
              height={0.3}
              offset={0.15}
              x-bind="$point.v2"
              y-bind="$point.category"
              tooltip-tpl="{$point.v2}"
            />
          </Repeater>
        </Chart>
      </Svg>
    </div>
  </cx>
);
