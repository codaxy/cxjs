import { Svg } from "cx/svg";
import {
  Chart,
  NumericAxis,
  Gridlines,
  Marker,
  MarkerLine,
  PointReducer,
} from "cx/charts";
import { createModel } from "cx/data";
import { Repeater, Controller } from "cx/ui";
import { Button } from "cx/widgets";

// @model
interface Point {
  x: number;
  y: number;
  size: number;
  color: number;
}

interface Model {
  points: Point[];
  avgX: number;
  avgY: number;
  $point: Point;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.generate();
  }

  generate() {
    this.store.set(
      m.points,
      Array.from({ length: 30 }, (_, i) => ({
        x: 30 + Math.random() * 240,
        y: 30 + Math.random() * 240,
        size: 15 + Math.random() * 25,
        color: i % 8,
      })),
    );
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController}>
    <Svg style="width: 100%; height: 320px">
      <Chart
        margin="30 30 40 50"
        axes={{
          x: { type: NumericAxis, min: 0, max: 300 },
          y: { type: NumericAxis, min: 0, max: 300, vertical: true },
        }}
      >
        <Gridlines />
        <PointReducer
          onInitAccumulator={(acc) => {
            acc.sumX = 0;
            acc.sumY = 0;
            acc.sumSize = 0;
          }}
          onMap={(acc, x, y, name, p) => {
            acc.sumX += x * p.size;
            acc.sumY += y * p.size;
            acc.sumSize += p.size;
          }}
          onReduce={(acc, { store }) => {
            if (acc.sumSize > 0) {
              store.set(m.avgX, acc.sumX / acc.sumSize);
              store.set(m.avgY, acc.sumY / acc.sumSize);
            }
          }}
        >
          <Repeater records={m.points} recordAlias="$point">
            <Marker
              colorIndex={m.$point.color}
              size={m.$point.size}
              x={m.$point.x}
              y={m.$point.y}
              style={{ fillOpacity: 0.6 }}
              draggableX
              draggableY
            />
          </Repeater>
          <MarkerLine x={m.avgX} colorIndex={9} />
          <MarkerLine y={m.avgY} colorIndex={9} />
        </PointReducer>
      </Chart>
    </Svg>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px">
      <Button onClick="generate">Generate</Button>
      <span style="color: #666">
        Drag markers to see weighted average update
      </span>
    </div>
  </div>
);
// @index-end
