import { Svg, Rectangle } from "cx/svg";
import { Chart, NumericAxis, CategoryAxis, Gridlines, Column } from "cx/charts";
import { createModel } from "cx/data";
import { Controller, Repeater, expr, format } from "cx/ui";
import { enableTooltips } from "cx/widgets";

enableTooltips();

// @model
interface Point {
  city: string;
  value: number;
}

interface Model {
  data: Point[];
  $point: Point;
}

const m = createModel<Model>();
// @model-end

const cities = [
  "Tokyo", "Delhi", "Shanghai", "São Paulo", "Mexico City",
  "Cairo", "Mumbai", "Beijing", "Dhaka", "Osaka",
  "New York", "Karachi", "Buenos Aires", "Istanbul", "Kolkata",
];

// @controller
class PageController extends Controller<typeof m> {
  onInit() {
    this.store.set(
      m.data,
      cities.map((city, i) => ({
        city,
        value: 10 + ((i + 1) / 15) * 40 + (Math.random() - 0.5) * 10,
      })),
    );
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <Svg style="height: 350px; border: 1px dashed #ddd">
      <Chart
        margin="20 20 120 50"
        axes={{
          x: (
            <CategoryAxis
              labelRotation={-90}
              labelDy="0.4em"
              labelAnchor="end"
            />
          ),
          y: <NumericAxis vertical snapToTicks={1} />,
        }}
      >
        <Rectangle fill="white" />
        <Gridlines />
        <Repeater records={m.data} recordAlias="$point">
          <Column
            colorIndex={expr(m.$point.value, (v) => 15 - Math.round((v * 6) / 50))}
            width={0.7}
            x={m.$point.city}
            y={m.$point.value}
            tooltip={format(m.$point.value, "n;1")}
          />
        </Repeater>
      </Chart>
    </Svg>
  </div>
);
// @index-end
