import { Svg, Rectangle } from "cx/svg";
import {
  Chart,
  NumericAxis,
  CategoryAxis,
  Gridlines,
  ColumnGraph,
  Legend,
} from "cx/charts";
import { createModel } from "cx/data";
import { Controller } from "cx/ui";

// @model
interface Model {
  data: { month: string; q1: number; q2: number }[];
  q1Active: boolean;
  q2Active: boolean;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.data, [
      { month: "Jan", q1: 42, q2: 38 },
      { month: "Feb", q1: 58, q2: 52 },
      { month: "Mar", q1: 65, q2: 71 },
      { month: "Apr", q1: 71, q2: 68 },
      { month: "May", q1: 85, q2: 79 },
      { month: "Jun", q1: 78, q2: 84 },
    ]);
    this.store.set(m.q1Active, true);
    this.store.set(m.q2Active, true);
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
          y: <NumericAxis vertical snapToTicks={1} />,
        }}
      >
        <Rectangle fill="white" />
        <Gridlines />
        <ColumnGraph
          name="Q1"
          data={m.data}
          colorIndex={0}
          xField="month"
          yField="q1"
          size={0.3}
          offset={-0.15}
          active={m.q1Active}
        />
        <ColumnGraph
          name="Q2"
          data={m.data}
          colorIndex={5}
          xField="month"
          yField="q2"
          size={0.3}
          offset={0.15}
          active={m.q2Active}
        />
      </Chart>
    </Svg>
  </div>
);
// @index-end
