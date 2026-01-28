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
import { createModel } from "cx/data";
import { Controller } from "cx/ui";
import { Button } from "cx/widgets";

// @model
interface Point {
  x: number;
  y: number;
}

interface Model {
  data: Point[];
  min: number;
  max: number;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.generate();
  }

  generate() {
    let y = 100;
    this.store.set(
      m.data,
      Array.from({ length: 50 }, (_, x) => ({
        x: x * 2,
        y: (y = y + Math.random() * 30 - 15),
      })),
    );
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <Svg style="width: 100%; height: 300px">
      <Chart
        margin="30 30 40 50"
        axes={{
          x: { type: NumericAxis },
          y: { type: NumericAxis, vertical: true, deadZone: 16 },
        }}
      >
        <Gridlines />
        <MinMaxFinder minY={m.min} maxY={m.max}>
          <Range y1={m.min} y2={m.max} colorIndex={4} />
          <LineGraph data={m.data} colorIndex={0} />
        </MinMaxFinder>
        <MarkerLine y={m.min} colorIndex={9}>
          <Text anchors="0 0 0 0" offset="5 0 0 0" dominantBaseline="hanging">
            Min
          </Text>
        </MarkerLine>
        <MarkerLine y={m.max} colorIndex={5}>
          <Text anchors="0 0 0 0" offset="-5 0 0 0">
            Max
          </Text>
        </MarkerLine>
      </Chart>
    </Svg>
    <Button onClick="generate">Generate</Button>
  </div>
);
// @index-end
