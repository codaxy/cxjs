import { Svg, Rectangle } from "cx/svg";
import { Chart, NumericAxis, CategoryAxis, Gridlines, Bar, Legend } from "cx/charts";
import { createModel } from "cx/data";
import { Controller, Repeater, format } from "cx/ui";
import { enableTooltips } from "cx/widgets";

enableTooltips();

// @model
interface Point {
  city: string;
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

// @controller
class PageController extends Controller<typeof m> {
  onInit() {
    this.store.set(m.data, [
      { city: "New York", q1: 120, q2: 80, q3: 95 },
      { city: "London", q1: 90, q2: 110, q3: 75 },
      { city: "Paris", q1: 75, q2: 65, q3: 85 },
      { city: "Tokyo", q1: 105, q2: 95, q3: 110 },
      { city: "Sydney", q1: 60, q2: 70, q3: 55 },
    ]);
    this.store.set(m.q1Active, true);
    this.store.set(m.q2Active, true);
    this.store.set(m.q3Active, true);
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController}>
    <Legend />
    <Svg style="height: 300px; border: 1px dashed #ddd">
      <Chart
        margin="20 20 30 80"
        axes={{
          x: <NumericAxis snapToTicks={0} />,
          y: <CategoryAxis vertical />,
        }}
      >
        <Rectangle fill="white" />
        <Gridlines />
        <Repeater records={m.data} recordAlias="$point">
          <Bar
            name="Q1"
            colorIndex={0}
            height={0.6}
            x={m.$point.q1}
            y={m.$point.city}
            stacked
            tooltip={format(m.$point.q1, "n;0")}
            active={m.q1Active}
          />
          <Bar
            name="Q2"
            colorIndex={5}
            height={0.6}
            x={m.$point.q2}
            y={m.$point.city}
            stacked
            tooltip={format(m.$point.q2, "n;0")}
            active={m.q2Active}
          />
          <Bar
            name="Q3"
            colorIndex={10}
            height={0.6}
            x={m.$point.q3}
            y={m.$point.city}
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
