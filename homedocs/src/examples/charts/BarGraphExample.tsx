import { Svg, Rectangle } from "cx/svg";
import {
  Chart,
  NumericAxis,
  CategoryAxis,
  Gridlines,
  BarGraph,
  Legend,
} from "cx/charts";
import { createModel } from "cx/data";
import { Controller } from "cx/ui";

// @model
interface Model {
  data: { city: string; q1: number; q2: number }[];
  q1Active: boolean;
  q2Active: boolean;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.data, [
      { city: "New York", q1: 85, q2: 92 },
      { city: "London", q1: 72, q2: 78 },
      { city: "Paris", q1: 65, q2: 71 },
      { city: "Tokyo", q1: 90, q2: 88 },
      { city: "Sydney", q1: 58, q2: 64 },
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
        margin="20 20 30 80"
        axes={{
          x: <NumericAxis snapToTicks={1} />,
          y: <CategoryAxis vertical />,
        }}
      >
        <Rectangle fill="white" />
        <Gridlines />
        <BarGraph
          name="Q1"
          data={m.data}
          colorIndex={0}
          xField="q1"
          yField="city"
          size={0.3}
          offset={-0.15}
          active={m.q1Active}
        />
        <BarGraph
          name="Q2"
          data={m.data}
          colorIndex={5}
          xField="q2"
          yField="city"
          size={0.3}
          offset={0.15}
          active={m.q2Active}
        />
      </Chart>
    </Svg>
  </div>
);
// @index-end
