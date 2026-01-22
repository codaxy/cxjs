import { Svg } from "cx/svg";
import {
  Chart,
  NumericAxis,
  Gridlines,
  LineGraph,
  MouseTracker,
  SnapPointFinder,
  Marker,
  MarkerLine,
} from "cx/charts";
import { createModel } from "cx/data";
import { Controller, hasValue } from "cx/ui";
import { Button, enableTooltips } from "cx/widgets";

enableTooltips();

// @model
interface Point {
  x: number;
  y: number;
}

interface Cursor {
  x: number;
  y: number;
}

interface Model {
  data: Point[];
  cursor: Cursor;
  snapX: number;
  snapY: number;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.generate();
  }

  generate() {
    let y = 150;
    this.store.set(
      m.data,
      Array.from({ length: 25 }, (_, x) => ({
        x: x * 4,
        y: (y = y + Math.random() * 20 - 10),
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
          y: { type: NumericAxis, vertical: true },
        }}
      >
        <MouseTracker x={m.cursor.x} y={m.cursor.y}>
          <Gridlines />
          <SnapPointFinder
            cursorX={m.cursor.x}
            snapX={m.snapX}
            snapY={m.snapY}
            maxDistance={Infinity}
          >
            <LineGraph data={m.data} colorIndex={0} />
          </SnapPointFinder>
          <MarkerLine visible={hasValue(m.snapX)} x={m.snapX} colorIndex={8} />
          <Marker
            visible={hasValue(m.snapX)}
            x={m.snapX}
            y={m.snapY}
            colorIndex={0}
            size={10}
            tooltip={{
              alwaysVisible: true,
              text: { tpl: "({snapX:n;0}, {snapY:n;1})" },
              placement: "up",
              destroyDelay: 0,
              createDelay: 0,
            }}
          />
        </MouseTracker>
      </Chart>
    </Svg>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px">
      <Button onClick="generate">Generate</Button>
      <span style="color: #666">Move mouse to snap to nearest data point</span>
    </div>
  </div>
);
// @index-end
