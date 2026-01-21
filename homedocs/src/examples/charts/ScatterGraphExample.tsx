import { Svg } from "cx/svg";
import { Chart, NumericAxis, Gridlines, ScatterGraph, Legend } from "cx/charts";
import { createModel } from "cx/data";
import { Controller } from "cx/ui";

// @model
interface Point {
  x: number;
  y: number;
  size: number;
}

interface Model {
  reds: Point[];
  blues: Point[];
  showReds: boolean;
  showBlues: boolean;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.showReds, true);
    this.store.set(m.showBlues, true);
    this.store.set(
      m.reds,
      Array.from({ length: 200 }, () => ({
        x: 100 + Math.random() * 300,
        y: Math.random() * 300,
        size: Math.random() * 20,
      })),
    );
    this.store.set(
      m.blues,
      Array.from({ length: 200 }, () => ({
        x: Math.random() * 300,
        y: 100 + Math.random() * 300,
        size: Math.random() * 20,
      })),
    );
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController} style="display: flex; gap: 16px">
    <Svg style="flex: 1; height: 400px">
      <Chart
        offset="20 -20 -40 40"
        axes={{
          x: { type: NumericAxis, snapToTicks: 1 },
          y: { type: NumericAxis, vertical: true, snapToTicks: 1 },
        }}
      >
        <Gridlines />
        <ScatterGraph
          data={m.reds}
          name="Reds"
          colorIndex={1}
          shape="square"
          sizeField="size"
          active={m.showReds}
        />
        <ScatterGraph
          data={m.blues}
          name="Blues"
          colorIndex={5}
          sizeField="size"
          active={m.showBlues}
        />
      </Chart>
    </Svg>
    <Legend vertical />
  </div>
);
// @index-end
