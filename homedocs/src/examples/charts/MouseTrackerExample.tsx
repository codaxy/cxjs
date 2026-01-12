/** @jsxImportSource cx */
import { Svg } from "cx/svg";
import {
  Chart,
  NumericAxis,
  Gridlines,
  MouseTracker,
  Marker,
  MarkerLine,
} from "cx/charts";
import { $page } from "../stores.js";

export default () => (
  <cx>
    <div>
      <Svg style="width: 100%; height: 300px;">
        <Chart
          margin="30 30 40 50"
          axes={{
            x: { type: NumericAxis, min: 0, max: 100 },
            y: { type: NumericAxis, min: 0, max: 100, vertical: true },
          }}
        >
          <Gridlines />
          <MouseTracker
            x={$page.cursor.x}
            y={$page.cursor.y}
            tooltip={{
              destroyDelay: 5,
              createDelay: 5,
              text: { tpl: "({cursor.x:n;1}, {cursor.y:n;1})" },
              trackMouse: true,
            }}
          >
            <Marker
              visible-expr="!!{cursor}"
              x={$page.cursor.x}
              y={$page.cursor.y}
              size={10}
              colorIndex={0}
            />
            <MarkerLine
              visible-expr="!!{cursor}"
              x={$page.cursor.x}
              y2={$page.cursor.y}
              y1={0}
              colorIndex={0}
            />
            <MarkerLine
              visible-expr="!!{cursor}"
              y={$page.cursor.y}
              x2={$page.cursor.x}
              colorIndex={0}
            />
          </MouseTracker>
        </Chart>
      </Svg>
      <p style="text-align: center; color: #666; margin-top: 8px;">
        Move your mouse over the chart to track position
      </p>
    </div>
  </cx>
);
