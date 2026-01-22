import { Svg, Rectangle } from "cx/svg";
import { Chart, NumericAxis, CategoryAxis, Gridlines, Column, Legend } from "cx/charts";
import { createModel } from "cx/data";
import { Controller, Repeater, format } from "cx/ui";
import { enableTooltips } from "cx/widgets";

enableTooltips();

// @model
interface Point {
  month: string;
  actual: number;
  budget: number | null;
  forecast: number | null;
}

interface Model {
  data: Point[];
  $point: Point;
  actualActive: boolean;
  budgetActive: boolean;
  forecastActive: boolean;
}

const m = createModel<Model>();
// @model-end

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// @controller
class PageController extends Controller<typeof m> {
  onInit() {
    this.store.set(
      m.data,
      months.map((month, i) => ({
        month,
        actual: Math.round(Math.random() * 50 + 30),
        budget: i < 9 ? Math.round(Math.random() * 50 + 30) : null,
        forecast: i < 6 ? Math.round(Math.random() * 50 + 30) : null,
      })),
    );
    this.store.set(m.actualActive, true);
    this.store.set(m.budgetActive, true);
    this.store.set(m.forecastActive, true);
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
          x: <CategoryAxis uniform />,
          y: <NumericAxis vertical snapToTicks={1} />,
        }}
      >
        <Rectangle fill="white" />
        <Gridlines />
        <Repeater records={m.data} recordAlias="$point">
          <Column
            name="Actual"
            colorIndex={0}
            width={0.8}
            x={m.$point.month}
            y={m.$point.actual}
            autoSize
            tooltip={format(m.$point.actual, "n;0")}
            active={m.actualActive}
          />
          <Column
            name="Budget"
            colorIndex={5}
            width={0.8}
            x={m.$point.month}
            y={m.$point.budget}
            autoSize
            tooltip={format(m.$point.budget, "n;0")}
            active={m.budgetActive}
          />
          <Column
            name="Forecast"
            colorIndex={10}
            width={0.8}
            x={m.$point.month}
            y={m.$point.forecast}
            autoSize
            tooltip={format(m.$point.forecast, "n;0")}
            active={m.forecastActive}
          />
        </Repeater>
      </Chart>
    </Svg>
  </div>
);
// @index-end
