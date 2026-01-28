import { Svg } from "cx/svg";
import {
  Chart,
  NumericAxis,
  Gridlines,
  MouseTracker,
  Marker,
  MarkerLine,
} from "cx/charts";
import { createModel } from "cx/data";
import { hasValue } from "cx/ui";
import { enableTooltips } from "cx/widgets";

enableTooltips();

// @model
interface Cursor {
  x: number;
  y: number;
}

interface Model {
  cursor: Cursor;
}

const m = createModel<Model>();
// @model-end

// @index
export default (
  <div>
    <Svg style="width: 100%; height: 300px">
      <Chart
        margin="30 30 40 50"
        axes={{
          x: { type: NumericAxis, min: 0, max: 100 },
          y: { type: NumericAxis, min: 0, max: 100, vertical: true },
        }}
      >
        <Gridlines />
        <MouseTracker
          x={m.cursor.x}
          y={m.cursor.y}
          tooltip={{
            destroyDelay: 5,
            createDelay: 5,
            text: { tpl: "({cursor.x:n;1}, {cursor.y:n;1})" },
            trackMouse: true,
          }}
        >
          <Marker
            visible={hasValue(m.cursor)}
            x={m.cursor.x}
            y={m.cursor.y}
            size={10}
            colorIndex={0}
          />
          <MarkerLine
            visible={hasValue(m.cursor)}
            x={m.cursor.x}
            y1={0}
            y2={m.cursor.y}
            colorIndex={0}
          />
          <MarkerLine
            visible={hasValue(m.cursor)}
            y={m.cursor.y}
            x2={m.cursor.x}
            x1={0}
            colorIndex={0}
          />
        </MouseTracker>
      </Chart>
    </Svg>
    <p style="text-align: center; color: #666; margin-top: 8px">
      Move your mouse over the chart to track position
    </p>
  </div>
);
// @index-end
