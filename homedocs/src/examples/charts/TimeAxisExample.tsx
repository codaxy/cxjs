/** @jsxImportSource cx */
import { Svg, Rectangle } from "cx/svg";
import { Chart, TimeAxis, NumericAxis, Gridlines, LineGraph } from "cx/charts";
import { Controller } from "cx/ui";

class PageController extends Controller {
  onInit() {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    this.store.set(
      "data",
      Array.from({ length: 30 }, (_, i) => ({
        date: new Date(now - (30 - i) * day),
        value: 50 + Math.sin(i * 0.3) * 30 + Math.random() * 20,
      })),
    );
  }
}

export default () => (
  <cx>
    <div controller={PageController}>
      <Svg style="width: 100%; height: 250px;">
        <Chart
          margin="20 20 40 50"
          axes={{
            x: { type: TimeAxis },
            y: { type: NumericAxis, vertical: true },
          }}
        >
          <Rectangle fill="white" />
          <Gridlines />
          <LineGraph
            data-bind="data"
            xField="date"
            yField="value"
            colorIndex={0}
            area
          />
        </Chart>
      </Svg>
    </div>
  </cx>
);
