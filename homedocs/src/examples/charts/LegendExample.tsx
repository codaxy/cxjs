import { Svg, Rectangle } from "cx/svg";
import { Chart, NumericAxis, Gridlines, LineGraph, Legend } from "cx/charts";
import { createModel } from "cx/data";
import { Controller } from "cx/ui";

// @model
interface Model {
  data: { x: number; sales: number; profit: number; costs: number }[];
  salesActive: boolean;
  profitActive: boolean;
  costsActive: boolean;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(
      m.data,
      Array.from({ length: 15 }, (_, i) => ({
        x: i * 10,
        sales: 50 + Math.random() * 50,
        profit: 30 + Math.random() * 40,
        costs: 20 + Math.random() * 30,
      })),
    );
    this.store.set(m.salesActive, true);
    this.store.set(m.profitActive, true);
    this.store.set(m.costsActive, true);
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <Legend />
    <Svg style="width: 500px; height: 300px;">
      <Chart
        margin="20 20 40 50"
        axes={{
          x: <NumericAxis />,
          y: <NumericAxis vertical />,
        }}
      >
        <Rectangle mod="cover" />
        <Gridlines />
        <LineGraph
          name="Sales"
          data={m.data}
          colorIndex={0}
          yField="sales"
          active={m.salesActive}
        />
        <LineGraph
          name="Profit"
          data={m.data}
          colorIndex={4}
          yField="profit"
          active={m.profitActive}
        />
        <LineGraph
          name="Costs"
          data={m.data}
          colorIndex={8}
          yField="costs"
          active={m.costsActive}
        />
      </Chart>
    </Svg>
  </div>
);
// @index-end
