/** @jsxImportSource cx */
import { Svg } from "cx/svg";
import {
  Chart,
  NumericAxis,
  Gridlines,
  LineGraph,
  MouseTracker,
  ValueAtFinder,
  Marker,
  MarkerLine,
  ColorMap,
  Legend,
} from "cx/charts";
import { Repeater, Controller } from "cx/ui";
import { $page, $record } from "../stores.js";

class PageController extends Controller {
  onInit() {
    this.store.set(
      "series",
      Array.from({ length: 3 }, (_, i) => {
        let y = 80 + Math.random() * 40;
        return {
          name: `Series ${i + 1}`,
          trackedValue: null,
          points: Array.from({ length: 20 }, (_, x) => ({
            x: x * 5,
            y: (y = y + Math.random() * 20 - 10),
          })),
        };
      }),
    );
  }
}

export default () => (
  <cx>
    <div controller={PageController}>
      <Legend />
      <Svg style="width: 100%; height: 300px;">
        <Chart
          margin="20 20 40 50"
          axes={{
            x: { type: NumericAxis },
            y: { type: NumericAxis, vertical: true },
          }}
        >
          <Gridlines />
          <MouseTracker x={$page.cursor.x}>
            <MarkerLine
              visible-expr="!!{cursor}"
              x={$page.cursor.x}
              colorIndex={8}
            />
            <ColorMap />
            <Repeater records={$page.series}>
              <ValueAtFinder at={$page.cursor.x} value={$record.trackedValue}>
                <LineGraph
                  name={$record.name}
                  data={$record.points}
                  colorMap="lines"
                />
              </ValueAtFinder>
              <Marker
                x={$page.cursor.x}
                y={$record.trackedValue}
                colorMap="lines"
                size={8}
                tooltip={{
                  text: { tpl: "{$record.name}: {$record.trackedValue:n;1}" },
                  placement: "right",
                  destroyDelay: 0,
                  createDelay: 0,
                }}
              />
            </Repeater>
          </MouseTracker>
        </Chart>
      </Svg>
      <p style="text-align: center; color: #666; margin-top: 8px;">
        Move mouse to track values on each line
      </p>
    </div>
  </cx>
);
