/** @jsxImportSource cx */
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
import { Controller } from "cx/ui";
import { $page } from "../stores.js";

class PageController extends Controller {
  onInit() {
    let y = 150;
    this.store.set(
      "data",
      Array.from({ length: 25 }, (_, x) => ({
        x: x * 4,
        y: (y = y + Math.random() * 20 - 10),
      })),
    );
  }
}

export default () => (
  <cx>
    <div controller={PageController}>
      <Svg style="width: 100%; height: 300px;">
        <Chart
          margin="30 30 40 50"
          axes={{
            x: { type: NumericAxis },
            y: { type: NumericAxis, vertical: true, min: 100, max: 200 },
          }}
        >
          <MouseTracker x={$page.cursor.x} y={$page.cursor.y}>
            <Gridlines />
            <SnapPointFinder
              cursorX={$page.cursor.x}
              snapX={$page.snapX}
              snapY={$page.snapY}
              maxDistance={Infinity}
            >
              <LineGraph data={$page.data} colorIndex={0} />
            </SnapPointFinder>
            <MarkerLine x={$page.snapX} colorIndex={8} />
            <Marker
              x={$page.snapX}
              y={$page.snapY}
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
      <p style="text-align: center; color: #666; margin-top: 8px;">
        Move mouse to snap to nearest data point
      </p>
    </div>
  </cx>
);
