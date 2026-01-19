/** @jsxImportSource cx */
import { Svg } from "cx/svg";
import { Chart, NumericAxis, Gridlines, Marker, Legend } from "cx/charts";
import { Repeater, Controller } from "cx/ui";

class PageController extends Controller {
  onInit() {
    this.store.set(
      "points",
      Array.from({ length: 20 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 10 + Math.random() * 20,
      })),
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
          <Repeater records-bind="points" recordAlias="$point">
            <Marker
              name="Data Points"
              colorIndex={2}
              x-bind="$point.x"
              y-bind="$point.y"
              size-bind="$point.size"
              tooltip-tpl="({$point.x:n;1}, {$point.y:n;1})"
              draggableX
              draggableY
            />
          </Repeater>
        </Chart>
      </Svg>
    </div>
  </cx>
);
