/** @jsxImportSource cx */
import { Svg, Text } from "cx/svg";
import {
  Chart,
  NumericAxis,
  Gridlines,
  LineGraph,
  MarkerLine,
} from "cx/charts";
import { Controller } from "cx/ui";

class PageController extends Controller {
  onInit() {
    let y = 50;
    const points = Array.from({ length: 30 }, (_, i) => ({
      x: i * 5,
      y: (y = y + (Math.random() - 0.5) * 20),
    }));

    const values = points.map((p) => p.y);
    this.store.set("points", points);
    this.store.set("min", Math.min(...values));
    this.store.set("max", Math.max(...values));
  }
}

export default () => (
  <cx>
    <div controller={PageController}>
      <Svg style="width: 100%; height: 280px;">
        <Chart
          margin="30 20 40 50"
          axes={{
            x: { type: NumericAxis },
            y: { type: NumericAxis, vertical: true },
          }}
        >
          <Gridlines />
          <MarkerLine y-bind="min" colorIndex={8}>
            <Text anchors="0 0 0 0" offset="5 0 0 5" dy="0.8em">
              Min
            </Text>
          </MarkerLine>
          <MarkerLine y-bind="max" colorIndex={4}>
            <Text anchors="0 0 0 0" offset="-5 0 0 5">
              Max
            </Text>
          </MarkerLine>
          <LineGraph data-bind="points" colorIndex={0} />
        </Chart>
      </Svg>
    </div>
  </cx>
);
