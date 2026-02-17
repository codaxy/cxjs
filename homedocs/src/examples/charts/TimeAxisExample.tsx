import { Svg, Rectangle } from "cx/svg";
import {
  Chart,
  NumericAxis,
  TimeAxis,
  Gridlines,
  ColumnGraph,
} from "cx/charts";
import { createModel } from "cx/data";
import { Controller, enableCultureSensitiveFormatting } from "cx/ui";

enableCultureSensitiveFormatting();

// @model
interface Model {
  data: { date: Date; value: number }[];
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(
      m.data,
      Array.from({ length: 24 }, (_, i) => ({
        date: new Date(2023, i, 1),
        value: Math.round(Math.random() * 1000),
      })),
    );
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <Svg style="width: 500px; height: 300px; border: 1px dashed #ddd">
      <Chart
        margin="60 20 40 60"
        axes={{
          x: <TimeAxis />,
          y: <NumericAxis vertical />,
        }}
      >
        <Rectangle fill="white" />
        <Gridlines />
        <ColumnGraph
          data={m.data}
          size={30 * 24 * 60 * 60 * 1000}
          offset={15 * 24 * 60 * 60 * 1000}
          xField="date"
          yField="value"
          colorIndex={0}
        />
      </Chart>
    </Svg>
  </div>
);
// @index-end
