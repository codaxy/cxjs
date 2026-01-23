import { Svg, Rectangle } from "cx/svg";
import {
  Chart,
  NumericAxis,
  CategoryAxis,
  Gridlines,
  Column,
  Legend,
} from "cx/charts";
import { createModel } from "cx/data";
import { Controller, Repeater, format } from "cx/ui";
import { enableTooltips } from "cx/widgets";

enableTooltips();

// @model
interface Point {
  month: string;
  q1: number;
  q2: number;
  q3: number;
}

interface Model {
  data: Point[];
  $point: Point;
  q1Active: boolean;
  q2Active: boolean;
  q3Active: boolean;
}

const m = createModel<Model>();
// @model-end

const months = [
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

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(
      m.data,
      months.map((month) => ({
        month,
        q1: Math.round(Math.random() * 30),
        q2: Math.round(Math.random() * 30),
        q3: Math.round(Math.random() * 30),
      })),
    );
    this.store.set(m.q1Active, true);
    this.store.set(m.q2Active, true);
    this.store.set(m.q3Active, true);
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <Legend />
    <Svg style="height: 300px; border: 1px dashed #ddd">
      <Chart
        margin="20 20 40 50"
        axes={{
          x: <CategoryAxis />,
          y: <NumericAxis vertical snapToTicks={0} />,
        }}
      >
        <Rectangle fill="white" />
        <Gridlines />
        <Repeater records={m.data} recordAlias="$point">
          <Column
            name="Q1"
            colorIndex={0}
            width={0.6}
            x={m.$point.month}
            y={m.$point.q1}
            stacked
            tooltip={format(m.$point.q1, "n;0")}
            active={m.q1Active}
          />
          <Column
            name="Q2"
            colorIndex={5}
            width={0.6}
            x={m.$point.month}
            y={m.$point.q2}
            stacked
            tooltip={format(m.$point.q2, "n;0")}
            active={m.q2Active}
          />
          <Column
            name="Q3"
            colorIndex={10}
            width={0.6}
            x={m.$point.month}
            y={m.$point.q3}
            stacked
            tooltip={format(m.$point.q3, "n;0")}
            active={m.q3Active}
          />
        </Repeater>
      </Chart>
    </Svg>
  </div>
);
// @index-end
