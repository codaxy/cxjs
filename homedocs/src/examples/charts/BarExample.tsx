import { Svg, Rectangle } from "cx/svg";
import {
  Chart,
  NumericAxis,
  CategoryAxis,
  Gridlines,
  Bar,
  Legend,
} from "cx/charts";
import { createModel } from "cx/data";
import { Controller, Repeater, format } from "cx/ui";
import { enableTooltips } from "cx/widgets";

enableTooltips();

// @model
interface Point {
  category: string;
  v1: number;
  v2: number;
}

interface Model {
  data: Point[];
  $point: Point;
  v1Active: boolean;
  v2Active: boolean;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.data, [
      { category: "Product A", v1: 120, v2: 80 },
      { category: "Product B", v1: 90, v2: 150 },
      { category: "Product C", v1: 180, v2: 100 },
      { category: "Product D", v1: 60, v2: 130 },
    ]);
    this.store.set(m.v1Active, true);
    this.store.set(m.v2Active, true);
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <Legend />
    <Svg style="height: 280px; border: 1px dashed #ddd">
      <Chart
        margin="20 20 30 100"
        axes={{
          x: <NumericAxis snapToTicks={0} />,
          y: <CategoryAxis vertical />,
        }}
      >
        <Rectangle fill="white" />
        <Gridlines />
        <Repeater records={m.data} recordAlias="$point">
          <Bar
            colorIndex={0}
            name="2023"
            height={0.3}
            offset={-0.15}
            x={m.$point.v1}
            y={m.$point.category}
            tooltip={format(m.$point.v1, "n;0")}
            active={m.v1Active}
          />
          <Bar
            colorIndex={5}
            name="2024"
            height={0.3}
            offset={0.15}
            x={m.$point.v2}
            y={m.$point.category}
            tooltip={format(m.$point.v2, "n;0")}
            active={m.v2Active}
          />
        </Repeater>
      </Chart>
    </Svg>
  </div>
);
// @index-end
