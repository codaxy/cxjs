import { Svg } from "cx/svg";
import {
  Chart,
  NumericAxis,
  CategoryAxis,
  Gridlines,
  Column,
  Bar,
  RangeMarker,
} from "cx/charts";
import { createModel } from "cx/data";
import { Controller, Repeater } from "cx/ui";

// @model
const categories = [
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
];

interface DataPoint {
  category: string;
  value: number;
  max: number;
  min: number;
  optimal: number;
}

interface Model {
  points: DataPoint[];
  $point: DataPoint;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    let v = 50;
    this.store.set(
      m.points,
      Array.from({ length: categories.length }, (_, i) => ({
        category: categories[i],
        value: (v = v + (Math.random() - 0.5) * 30),
        max: v + 30 * Math.random(),
        min: v - 30 * Math.random(),
        optimal: v - 10 * Math.random() + 5,
      })),
    );
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController}>
    <div style="display: flex; flex-wrap: wrap; gap: 16px">
      <Svg style="flex: 1; min-width: 300px; height: 300px">
        <Chart
          offset="20 -20 -40 40"
          axes={{
            x: { type: CategoryAxis },
            y: { type: NumericAxis, vertical: true },
          }}
        >
          <Gridlines />
          <Repeater records={m.points} recordAlias="$point">
            <Column
              colorIndex={12}
              size={0.7}
              x={m.$point.category}
              y={m.$point.value}
              tooltip={{ tpl: "{$point.category} {$point.value:n;1}" }}
            />
            <RangeMarker
              x={m.$point.category}
              y={m.$point.max}
              lineStyle="stroke: blue"
              size={0.7}
              inflate={3}
              shape="max"
            />
            <RangeMarker
              x={m.$point.category}
              y={m.$point.min}
              lineStyle="stroke: red"
              size={0.7}
              inflate={3}
              shape="min"
            />
            <RangeMarker
              x={m.$point.category}
              y={m.$point.optimal}
              lineStyle="stroke: green"
              size={0.7}
              inflate={3}
              shape="line"
            />
          </Repeater>
        </Chart>
      </Svg>
      <Svg style="flex: 1; min-width: 300px; height: 300px">
        <Chart
          offset="20 -20 -40 40"
          axes={{
            x: { type: NumericAxis, snapToTicks: 0 },
            y: { type: CategoryAxis, vertical: true },
          }}
        >
          <Gridlines />
          <Repeater records={m.points} recordAlias="$point">
            <Bar
              colorIndex={13}
              size={0.7}
              x={m.$point.value}
              y={m.$point.category}
              tooltip={{ tpl: "{$point.category} {$point.value:n;1}" }}
            />
            <RangeMarker
              y={m.$point.category}
              x={m.$point.max}
              lineStyle="stroke: red"
              size={0.7}
              shape="max"
              inflate={3}
              vertical
            />
            <RangeMarker
              y={m.$point.category}
              x={m.$point.min}
              lineStyle="stroke: blue"
              size={0.7}
              shape="min"
              inflate={3}
              vertical
            />
            <RangeMarker
              y={m.$point.category}
              x={m.$point.optimal}
              lineStyle="stroke: green"
              size={0.7}
              shape="line"
              inflate={3}
              vertical
            />
          </Repeater>
        </Chart>
      </Svg>
    </div>
  </div>
);
// @index-end
