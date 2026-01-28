import { Svg } from "cx/svg";
import {
  Chart,
  NumericAxis,
  CategoryAxis,
  Gridlines,
  Column,
  RangeMarker,
} from "cx/charts";
import { Repeater, Controller } from "cx/ui";

const categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

class PageController extends Controller {
  onInit() {
    let v = 150;
    this.store.set(
      "points",
      categories.map((month) => ({
        month,
        value: (v = v + (Math.random() - 0.5) * 40),
        max: v + 20 + Math.random() * 15,
        min: v - 20 - Math.random() * 15,
        target: v + Math.random() * 10 - 5,
      })),
    );
  }
}

export default (
  <div controller={PageController}>
    <Svg style="width: 100%; height: 300px;">
      <Chart
        margin="20 20 40 50"
        axes={{
          x: { type: CategoryAxis },
          y: { type: NumericAxis, vertical: true },
        }}
      >
        <Gridlines />
        <Repeater records-bind="points" recordAlias="$point">
          <Column
            colorIndex={4}
            width={0.6}
            x-bind="$point.month"
            y-bind="$point.value"
          />
          <RangeMarker
            x-bind="$point.month"
            y-bind="$point.max"
            lineStyle="stroke: #e74c3c; stroke-width: 2px;"
            size={0.6}
            inflate={2}
            shape="max"
          />
          <RangeMarker
            x-bind="$point.month"
            y-bind="$point.min"
            lineStyle="stroke: #3498db; stroke-width: 2px;"
            size={0.6}
            inflate={2}
            shape="min"
          />
          <RangeMarker
            x-bind="$point.month"
            y-bind="$point.target"
            lineStyle="stroke: #2ecc71; stroke-width: 2px;"
            size={0.6}
            inflate={2}
            shape="line"
          />
        </Repeater>
      </Chart>
    </Svg>
    <div style="text-align: center; font-size: 12px; color: #666; margin-top: 8px;">
      <span style="color: #e74c3c;">Red: Max</span> |{" "}
      <span style="color: #3498db;">Blue: Min</span> |{" "}
      <span style="color: #2ecc71;">Green: Target</span>
    </div>
  </div>
);
