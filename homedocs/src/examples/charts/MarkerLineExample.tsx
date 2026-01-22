import { Svg, Text } from "cx/svg";
import {
  Chart,
  NumericAxis,
  Gridlines,
  LineGraph,
  MarkerLine,
  Legend,
} from "cx/charts";
import { createModel } from "cx/data";
import { Controller } from "cx/ui";
import { Button } from "cx/widgets";

// @model
interface Point {
  x: number;
  y: number;
}

interface Extremes {
  min: number;
  max: number;
}

interface Model {
  points: Point[];
  extremes: Extremes;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.generate();
    this.addComputable(m.extremes, [m.points], (points) => {
      if (!points || points.length === 0) return { min: 0, max: 0 };
      let min = points[0].y;
      let max = points[0].y;
      for (let i = 1; i < points.length; i++) {
        if (points[i].y < min) min = points[i].y;
        if (points[i].y > max) max = points[i].y;
      }
      return { min, max };
    });
  }

  generate() {
    let y = 100;
    this.store.set(
      m.points,
      Array.from({ length: 101 }, (_, i) => ({
        x: i * 4,
        y: (y = y + (Math.random() - 0.5) * 30),
      })),
    );
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <Svg style="width: 100%; height: 350px">
      <Chart
        offset="20 -10 -40 40"
        axes={{
          x: { type: NumericAxis },
          y: { type: NumericAxis, vertical: true, deadZone: 20 },
        }}
      >
        <Gridlines />
        <MarkerLine y={m.extremes.min} colorIndex={6}>
          <Text anchors="0 0 0 0" offset="5 0 0 5" dominantBaseline="hanging">
            Min
          </Text>
        </MarkerLine>
        <MarkerLine y={m.extremes.max} colorIndex={3}>
          <Text anchors="0 0 0 0" offset="-5 0 0 5">
            Max
          </Text>
        </MarkerLine>
        <LineGraph data={m.points} colorIndex={0} />
      </Chart>
    </Svg>
    <Legend />
    <Button onClick="generate">Generate</Button>
  </div>
);
// @index-end
