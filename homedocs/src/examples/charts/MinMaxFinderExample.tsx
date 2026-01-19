/** @jsxImportSource cx */
import { Svg, Text } from "cx/svg";
import {
  Chart,
  NumericAxis,
  Gridlines,
  LineGraph,
  MinMaxFinder,
  Range,
  MarkerLine,
} from "cx/charts";
import { Controller } from "cx/ui";

class PageController extends Controller {
  onInit() {
    let y = 100;
    this.store.set(
      "data",
      Array.from({ length: 50 }, (_, x) => ({
        x: x * 2,
        y: (y = y + Math.random() * 30 - 15),
      })),
    );
  }
}

export default () => (
  <cx>
    <div controller={PageController}>
      <Svg style="width: 100%; height: 300px;">
        <Chart
          margin="30 30 40 50"
          axes={{
            x: { type: NumericAxis },
            y: { type: NumericAxis, vertical: true },
          }}
        >
          <Gridlines />
          <MinMaxFinder minY-bind="min" maxY-bind="max">
            <Range y1-bind="min" y2-bind="max" colorIndex={4} />
            <LineGraph data-bind="data" colorIndex={0} />
          </MinMaxFinder>
          <MarkerLine y-bind="min" colorIndex={9}>
            <Text anchors="0 0 0 0" offset="5 0 0 0" dy="1em">
              Min
            </Text>
          </MarkerLine>
          <MarkerLine y-bind="max" colorIndex={5}>
            <Text anchors="0 0 0 0" offset="5 0 0 0" dy="-0.5em">
              Max
            </Text>
          </MarkerLine>
        </Chart>
      </Svg>
    </div>
  </cx>
);
