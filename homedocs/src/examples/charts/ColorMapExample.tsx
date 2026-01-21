import { Svg } from "cx/svg";
import {
  Chart,
  NumericAxis,
  Gridlines,
  LineGraph,
  ColorMap,
  Legend,
} from "cx/charts";
import { createModel } from "cx/data";
import { Repeater, Controller } from "cx/ui";

// @model
interface Point {
  x: number;
  y: number;
}

interface Series {
  name: string;
  active: boolean;
  points: Point[];
}

interface Model {
  series: Series[];
  $record: Series;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(
      m.series,
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
// @controller-end

// @index
export default () => (
  <div controller={PageController}>
    <Legend />
    <Svg style="width: 100%; height: 280px">
      <Chart
        margin="20 20 40 50"
        axes={{
          x: { type: NumericAxis },
          y: { type: NumericAxis, vertical: true },
        }}
      >
        <Gridlines />
        <ColorMap />
        <Repeater records={m.series} recordAlias="$record">
          <LineGraph
            name={m.$record.name}
            active={m.$record.active}
            data={m.$record.points}
            colorMap="lines"
          />
        </Repeater>
      </Chart>
    </Svg>
  </div>
);
// @index-end
