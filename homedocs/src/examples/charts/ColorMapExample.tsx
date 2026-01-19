/** @jsxImportSource cx */
import { Svg } from "cx/svg";
import {
  Chart,
  NumericAxis,
  Gridlines,
  LineGraph,
  ColorMap,
  Legend,
} from "cx/charts";
import { Repeater, Controller } from "cx/ui";

class PageController extends Controller {
  onInit() {
    this.store.set(
      "series",
      Array.from({ length: 5 }, (_, i) => {
        let y = 50 + Math.random() * 50;
        return {
          name: `Series ${i + 1}`,
          active: true,
          points: Array.from({ length: 20 }, (_, x) => ({
            x: x * 5,
            y: (y = y + Math.random() * 20 - 10),
          })),
        };
      }),
    );
  }
}

export default () => (
  <cx>
    <div controller={PageController}>
      <Legend />
      <Svg style="width: 100%; height: 280px;">
        <Chart
          margin="20 20 40 50"
          axes={{
            x: { type: NumericAxis },
            y: { type: NumericAxis, vertical: true },
          }}
        >
          <Gridlines />
          <ColorMap />
          <Repeater records-bind="series">
            <LineGraph
              name-bind="$record.name"
              active-bind="$record.active"
              data-bind="$record.points"
              colorMap="lines"
            />
          </Repeater>
        </Chart>
      </Svg>
    </div>
  </cx>
);
