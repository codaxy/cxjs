/** @jsxImportSource cx */
import { Svg } from "cx/svg";
import {
  Chart,
  NumericAxis,
  CategoryAxis,
  Gridlines,
  Column,
  Legend,
} from "cx/charts";
import { Repeater, Controller } from "cx/ui";

class PageController extends Controller {
  onInit() {
    this.store.set("data", [
      { month: "Jan", value: 35 },
      { month: "Feb", value: 48 },
      { month: "Mar", value: 62 },
      { month: "Apr", value: 55 },
      { month: "May", value: 71 },
      { month: "Jun", value: 68 },
    ]);
  }
}

export default () => (
  <cx>
    <div controller={PageController}>
      <Legend />
      <Svg style="width: 100%; height: 280px;">
        <Chart
          margin="20 20 40 50"
          axes={{
            x: { type: CategoryAxis },
            y: { type: NumericAxis, vertical: true },
          }}
        >
          <Gridlines />
          <Repeater records-bind="data" recordAlias="$point">
            <Column
              name="Sales"
              colorIndex={2}
              width={0.6}
              x-bind="$point.month"
              y-bind="$point.value"
              tooltip-tpl="{$point.month}: {$point.value}"
            />
          </Repeater>
        </Chart>
      </Svg>
    </div>
  </cx>
);
