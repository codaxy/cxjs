import { Svg, Rectangle, ClipRect } from "cx/svg";
import {
  Chart,
  TimeAxis,
  NumericAxis,
  Range,
  Marker,
  Gridlines,
  ColumnGraph,
} from "cx/charts";
import { createModel } from "cx/data";
import { Controller } from "cx/ui";

// @model
interface Point {
  date: Date;
  value: number;
}

interface Model {
  data: Point[];
  range: {
    from: number;
    to: number;
  };
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.range, {
      from: new Date(2011, 0, 1).valueOf(),
      to: new Date(2012, 0, 1).valueOf(),
    });

    let v = 2000;
    this.store.set(
      m.data,
      Array.from({ length: 10 * 12 }, (_, i) => ({
        date: new Date(2005, i, 1),
        value: (v = v + Math.random() * 300 - 150),
      })),
    );
  }
}
// @controller-end

const DAY = 24 * 60 * 60 * 1000;

// @index
export default (
  <div controller={PageController}>
    <Svg style="width: 100%; height: 500px" margin="60 10 60 60">
      <Chart
        anchors="0 1 0.8 0"
        offset="0 0 -50 0"
        axes={{
          x: (
            <TimeAxis min={m.range.from} max={m.range.to} snapToTicks={false} />
          ),
          y: <NumericAxis vertical />,
        }}
      >
        <Rectangle fill="white" />
        <Gridlines />
        <ClipRect>
          <ColumnGraph
            data={m.data}
            colorIndex={4}
            offset={15 * DAY}
            size={30 * DAY}
            xField="date"
            yField="value"
          />
        </ClipRect>
      </Chart>

      <Chart
        anchors="0.8 1 1 0"
        axes={{
          x: <TimeAxis />,
          y: <NumericAxis vertical />,
        }}
      >
        <Rectangle fill="white" />
        <Gridlines />
        <ColumnGraph
          data={m.data}
          size={30 * DAY}
          offset={15 * DAY}
          xField="date"
          yField="value"
        />

        <Range x1={m.range.from} x2={m.range.to} hidden>
          <ClipRect>
            <ColumnGraph
              data={m.data}
              colorIndex={4}
              size={30 * DAY}
              offset={15 * DAY}
              xField="date"
              yField="value"
            />
          </ClipRect>
          <Range
            colorIndex={4}
            x1={m.range.from}
            x2={m.range.to}
            style="cursor: move"
            draggableX
            constrainX
          />
        </Range>

        <Marker
          colorIndex={4}
          x={m.range.from}
          size={10}
          draggableX
          constrain
        />

        <Marker colorIndex={4} x={m.range.to} size={10} draggableX constrain />
      </Chart>
    </Svg>
  </div>
);
// @index-end
