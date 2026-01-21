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
import { Controller, Repeater, expr } from "cx/ui";

// @model
interface Point {
  city: string;
  max: number;
  value: number;
}

interface Model {
  data: Point[];
  $point: Point;
}

const m = createModel<Model>();
// @model-end

const cities = [
  "Tokyo",
  "New York",
  "London",
  "Paris",
  "Sydney",
  "Berlin",
  "Toronto",
];

// @controller
class PageController extends Controller {
  onInit() {
    let max = 200;
    this.store.set(
      m.data,
      cities.map((city) => ({
        city,
        max: (max = 0.95 * max),
        value: (0.5 + 0.5 * Math.random()) * max,
      })),
    );
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController}>
    <Legend />
    <Svg style="height: 320px; border: 1px dashed #ddd">
      <Chart
        margin="20 20 30 80"
        axes={{
          x: <NumericAxis snapToTicks={0} />,
          y: <CategoryAxis vertical inverted />,
        }}
      >
        <Rectangle fill="white" />
        <Repeater records={m.data} recordAlias="$point">
          <Bar
            name="Poor"
            size={0.9}
            style="stroke:none;fill:#f44336;opacity:0.2"
            x={expr(m.$point.max, (max) => 0.6 * max)}
            y={m.$point.city}
          />
          <Bar
            name="Satisfactory"
            size={0.9}
            style="stroke:none;fill:#ff9800;opacity:0.2"
            x0={expr(m.$point.max, (max) => 0.6 * max)}
            x={expr(m.$point.max, (max) => 0.8 * max)}
            y={m.$point.city}
          />
          <Bar
            name="Good"
            size={0.9}
            style="stroke:none;fill:#4caf50;opacity:0.2"
            x0={expr(m.$point.max, (max) => 0.8 * max)}
            x={m.$point.max}
            y={m.$point.city}
          />

          <Bar
            name="Actual"
            size={0.9}
            style="fill:#555"
            height={0.2}
            x={m.$point.value}
            y={m.$point.city}
          />
          <Bar
            name="Target"
            size={0.9}
            style="stroke:red;stroke-width:1px"
            height={0.5}
            x={expr(m.$point.max, (max) => 0.7 * max)}
            x0={expr(m.$point.max, (max) => 0.699 * max)}
            y={m.$point.city}
          />
        </Repeater>
        <Gridlines yAxis={false} />
      </Chart>
    </Svg>
  </div>
);
// @index-end
