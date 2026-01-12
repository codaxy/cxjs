/** @jsxImportSource cx */
import { Svg } from "cx/svg";
import {
  Chart,
  NumericAxis,
  Gridlines,
  Marker,
  MarkerLine,
  PointReducer,
} from "cx/charts";
import { Repeater, Controller } from "cx/ui";

class PageController extends Controller {
  onInit() {
    this.store.set(
      "points",
      Array.from({ length: 8 }, (_, i) => ({
        x: 30 + Math.random() * 240,
        y: 30 + Math.random() * 240,
        size: 15 + Math.random() * 25,
        color: i % 8,
      })),
    );
  }
}

export default () => (
  <cx>
    <div controller={PageController}>
      <Svg style="width: 100%; height: 320px;">
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
                store.set("avgX", acc.sumX / acc.sumSize);
                store.set("avgY", acc.sumY / acc.sumSize);
              }
            }}
          >
            <Repeater records-bind="points" recordAlias="$point">
              <Marker
                colorIndex-bind="$point.color"
                size-bind="$point.size"
                x-bind="$point.x"
                y-bind="$point.y"
                style={{ fillOpacity: 0.6 }}
                draggableX
                draggableY
              />
            </Repeater>
            <MarkerLine x-bind="avgX" colorIndex={9} />
            <MarkerLine y-bind="avgY" colorIndex={9} />
            <Marker x-bind="avgX" y-bind="avgY" colorIndex={9} size={12} />
          </PointReducer>
        </Chart>
      </Svg>
      <p style="text-align: center; color: #666; margin-top: 8px;">
        Drag markers to see weighted average (crosshair) update
      </p>
    </div>
  </cx>
);
