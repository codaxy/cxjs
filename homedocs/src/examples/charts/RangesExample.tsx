/** @jsxImportSource cx */
import { Svg, Text } from "cx/svg";
import {
  Chart,
  NumericAxis,
  Gridlines,
  LineGraph,
  Range,
  Legend,
} from "cx/charts";
import { Controller } from "cx/ui";

class PageController extends Controller {
  onInit() {
    let y = 50;
    this.store.set(
      "points",
      Array.from({ length: 30 }, (_, i) => ({
        x: i * 5,
        y: (y = y + (Math.random() - 0.45) * 20),
      })),
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
          <Range x1={40} x2={80} colorIndex={10} name="Target Zone">
            <Text anchors="0 0.5 0 0.5" offset="5 0 0 0" ta="middle" dy="0.8em">
              Target
            </Text>
          </Range>
          <Range y1={40} y2={70} colorIndex={4} name="Safe Range">
            <Text anchors="0.5 0 0.5 0" dy="0.4em" dx={5}>
              Safe
            </Text>
          </Range>
          <LineGraph data-bind="points" colorIndex={0} />
        </Chart>
      </Svg>
    </div>
  </cx>
);
