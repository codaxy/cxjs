import { Svg, Text } from "cx/svg";
import {
  Chart,
  NumericAxis,
  CategoryAxis,
  Swimlane,
} from "cx/charts";
import { createModel } from "cx/data";
import { Controller, Repeater } from "cx/ui";

// @model
interface Point {
  category: string;
  value: number;
}

interface Model {
  points: Point[];
  $point: Point;
  $index: number;
}

const m = createModel<Model>();
// @model-end

const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "Austin",
];

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(
      m.points,
      cities.map((category) => ({
        category,
        value: 10 + Math.random() * 40,
      })),
    );
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <div style="display: flex; flex-wrap: wrap; gap: 16px">
      <Svg style="flex: 1; min-width: 300px; height: 350px">
        <Chart
          offset="20 -20 -20 40"
          axes={{
            x: { type: CategoryAxis, hidden: true },
            y: { type: NumericAxis, vertical: true },
          }}
        >
          <Repeater records={m.points} recordAlias="$point" indexAlias="$index">
            <Swimlane size={0.8} x={m.$point.category} vertical>
              <Text
                value={m.$point.category}
                anchors="0.5 0.5 0.5 0.5"
                dominantBaseline="middle"
                textAnchor="middle"
                style="fill: #888; transform: rotate(-90deg); transform-box: fill-box; transform-origin: center"
              />
            </Swimlane>
          </Repeater>
        </Chart>
      </Svg>
      <Svg style="flex: 1; min-width: 300px; height: 350px">
        <Chart
          offset="20 -20 -40 20"
          axes={{
            x: { type: NumericAxis, snapToTicks: 0 },
            y: { type: CategoryAxis, vertical: true, hidden: true },
          }}
        >
          <Repeater records={m.points} recordAlias="$point">
            <Swimlane size={0.8} y={m.$point.category}>
              <Text
                value={m.$point.category}
                anchors="0.5 0 0.5 0"
                dx={5}
                dominantBaseline="middle"
                style="fill: #888"
              />
            </Swimlane>
          </Repeater>
        </Chart>
      </Svg>
    </div>
  </div>
);
// @index-end
