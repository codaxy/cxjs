import { Svg, Rectangle } from "cx/svg";
import { Chart, NumericAxis, Gridlines, LineGraph, Legend } from "cx/charts";
import { createModel } from "cx/data";
import { Controller } from "cx/ui";
import { Checkbox } from "cx/widgets";

// @model
interface Model {
  data: { x: number; y1: number; y2: number; y3: number }[];
  stacked: boolean;
  line1Active: boolean;
  line2Active: boolean;
  line3Active: boolean;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    let y1 = 300,
      y2 = 200,
      y3 = 100;
    this.store.set(
      m.data,
      Array.from({ length: 50 }, (_, i) => ({
        x: i * 4,
        y1: (y1 = y1 + (Math.random() - 0.5) * 30),
        y2: (y2 = y2 + (Math.random() - 0.5) * 30),
        y3: (y3 = y3 + (Math.random() - 0.5) * 30),
      })),
    );
    this.store.set(m.stacked, true);
    this.store.set(m.line1Active, true);
    this.store.set(m.line2Active, true);
    this.store.set(m.line3Active, true);
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <Legend />
    <Svg style="width: 500px; height: 300px; border: 1px dashed #ddd">
      <Chart
        margin="20 20 40 50"
        axes={{
          x: <NumericAxis />,
          y: <NumericAxis vertical />,
        }}
      >
        <Rectangle fill="white" />
        <Gridlines />
        <LineGraph
          name="Series 1"
          data={m.data}
          colorIndex={0}
          yField="y1"
          area={m.stacked}
          stacked={m.stacked}
          active={m.line1Active}
        />
        <LineGraph
          name="Series 2"
          data={m.data}
          colorIndex={5}
          yField="y2"
          area={m.stacked}
          stacked={m.stacked}
          active={m.line2Active}
        />
        <LineGraph
          name="Series 3"
          data={m.data}
          colorIndex={10}
          yField="y3"
          area={m.stacked}
          stacked={m.stacked}
          active={m.line3Active}
        />
      </Chart>
    </Svg>
    <div style="margin-top: 8px">
      <Checkbox value={m.stacked}>Stacked</Checkbox>
    </div>
  </div>
);
// @index-end
