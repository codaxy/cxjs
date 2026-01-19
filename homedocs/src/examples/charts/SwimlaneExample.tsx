/** @jsxImportSource cx */
import { Svg } from "cx/svg";
import { Chart, NumericAxis, CategoryAxis, Swimlane, Column } from "cx/charts";
import { Repeater, Controller } from "cx/ui";

class PageController extends Controller {
  onInit() {
    this.store.set("data", [
      { category: "Q1", value: 45 },
      { category: "Q2", value: 62 },
      { category: "Q3", value: 38 },
      { category: "Q4", value: 71 },
    ]);
  }
}

export default () => (
  <cx>
    <div controller={PageController}>
      <Svg style="width: 100%; height: 280px;">
        <Chart
          margin="20 20 40 50"
          axes={{
            x: { type: CategoryAxis },
            y: { type: NumericAxis, vertical: true },
          }}
        >
          <Repeater records-bind="data" recordAlias="$point">
            <Swimlane size={0.9} x-bind="$point.category" vertical />
            <Column
              colorIndex={0}
              width={0.5}
              x-bind="$point.category"
              y-bind="$point.value"
            />
          </Repeater>
        </Chart>
      </Svg>
    </div>
  </cx>
);
