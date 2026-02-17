import { Svg, Text } from "cx/svg";
import {
  Chart,
  NumericAxis,
  Gridlines,
  Range,
  Marker,
  LineGraph,
  Legend,
  LegendScope,
} from "cx/charts";
import { createModel } from "cx/data";
import { Controller } from "cx/ui";

// @model
interface Point {
  x: number;
  y: number;
}

interface RangePoint {
  x: number;
  y: number;
}

interface Model {
  points: Point[];
  p1: RangePoint;
  p2: RangePoint;
  xrange: boolean;
  yrange: boolean;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.xrange, true);
    this.store.set(m.yrange, true);
    let y = 200;
    this.store.set(
      m.points,
      Array.from({ length: 101 }, (_, i) => ({
        x: i * 4,
        y: (y = y + (Math.random() - 0.4) * 30),
      })),
    );
    this.store.set(m.p1, { x: 150, y: 250 });
    this.store.set(m.p2, { x: 250, y: 350 });
  }
}
// @controller-end

// @index
export default (
  <LegendScope controller={PageController}>
    <Svg style="width: 100%; height: 400px">
      <Chart
        offset="20 -10 -40 40"
        axes={{
          x: { type: NumericAxis },
          y: { type: NumericAxis, vertical: true },
        }}
      >
        <Gridlines />
        <Range
          x1={m.p1.x}
          x2={m.p2.x}
          colorIndex={11}
          name="X Range"
          active={m.yrange}
        >
          <Text
            anchors="0 0.5 0 0.5"
            offset="5 0 0 0"
            textAnchor="middle"
            dominantBaseline="hanging"
          >
            X Range
          </Text>
        </Range>
        <Range
          y1={m.p1.y}
          y2={m.p2.y}
          colorIndex={8}
          name="Y Range"
          active={m.xrange}
        >
          <Text anchors="0.5 0 0.5 0" dominantBaseline="middle" dx={5}>
            Y Range
          </Text>
        </Range>
        <LineGraph data={m.points} colorIndex={0} />
        <Marker colorIndex={11} x={m.p1.x} size={10} draggableX />
        <Marker colorIndex={11} x={m.p2.x} size={10} draggableX />
        <Marker colorIndex={8} y={m.p1.y} size={10} draggableY />
        <Marker colorIndex={8} y={m.p2.y} size={10} draggableY />
      </Chart>
    </Svg>
    <Legend />
  </LegendScope>
);
// @index-end
