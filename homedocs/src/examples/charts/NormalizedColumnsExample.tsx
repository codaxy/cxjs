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
  year: number;
  v1: number;
  v2: number;
  v3: number;
}

interface Model {
  data: Point[];
  $point: Point;
  v1Active: boolean;
  v2Active: boolean;
  v3Active: boolean;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    let v1 = 500,
      v2 = 500,
      v3 = 500;
    this.store.set(
      m.data,
      Array.from({ length: 10 }, (_, i) => ({
        year: 2015 + i,
        v1: (v1 = v1 + (Math.random() - 0.5) * 100),
        v2: (v2 = v2 + (Math.random() - 0.5) * 100),
        v3: (v3 = v3 + (Math.random() - 0.5) * 100),
      })),
    );
    this.store.set(m.v1Active, true);
    this.store.set(m.v2Active, true);
    this.store.set(m.v3Active, true);
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
          y: <NumericAxis vertical normalized format="p;0" />,
        }}
      >
        <Rectangle fill="white" />
        <Gridlines />
        <Repeater records={m.data} recordAlias="$point">
          <Column
            name="Product A"
            colorIndex={0}
            x={m.$point.year}
            y={m.$point.v1}
            stacked
            tooltip={format(m.$point.v1, "n;0")}
            active={m.v1Active}
          />
          <Column
            name="Product B"
            colorIndex={5}
            x={m.$point.year}
            y={m.$point.v2}
            stacked
            tooltip={format(m.$point.v2, "n;0")}
            active={m.v2Active}
          />
          <Column
            name="Product C"
            colorIndex={10}
            x={m.$point.year}
            y={m.$point.v3}
            stacked
            tooltip={format(m.$point.v3, "n;0")}
            active={m.v3Active}
          />
        </Repeater>
      </Chart>
    </Svg>
  </div>
);
// @index-end
