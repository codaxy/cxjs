import { Svg } from "cx/svg";
import { Chart, NumericAxis, Gridlines, Marker, Legend } from "cx/charts";
import { createModel } from "cx/data";
import { Repeater, Controller } from "cx/ui";

// @model
interface Point {
  x: number;
  y: number;
  size: number;
  color: number;
}

interface Model {
  reds: Point[];
  blues: Point[];
  showReds: boolean;
  showBlues: boolean;
  $point: Point;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.showReds, true);
    this.store.set(m.showBlues, true);
    this.store.set(
      m.reds,
      Array.from({ length: 50 }, () => ({
        x: 100 + Math.random() * 300,
        y: Math.random() * 300,
        size: 10 + Math.random() * 30,
        color: Math.floor(Math.random() * 3),
      })),
    );
    this.store.set(
      m.blues,
      Array.from({ length: 50 }, () => ({
        x: Math.random() * 300,
        y: 100 + Math.random() * 300,
        size: 10 + Math.random() * 30,
        color: 4 + Math.floor(Math.random() * 3),
      })),
    );
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController} style="display: flex; gap: 16px">
    <Svg style="flex: 1; height: 400px">
      <Chart
        offset="20 -20 -40 40"
        axes={{
          x: { type: NumericAxis, snapToTicks: 1 },
          y: { type: NumericAxis, vertical: true, snapToTicks: 1 },
        }}
      >
        <Gridlines />
        <Repeater records={m.reds} recordAlias="$point">
          <Marker
            colorIndex={m.$point.color}
            legendColorIndex={1}
            active={m.showReds}
            name="Reds"
            size={m.$point.size}
            x={m.$point.x}
            y={m.$point.y}
            tooltip={{ tpl: "Red ({$point.x:n;0}, {$point.y:n;0})" }}
            style={{ fillOpacity: 0.5 }}
            draggableX
            draggableY
            shape="rect"
            rx={3}
          />
        </Repeater>
        <Repeater records={m.blues} recordAlias="$point">
          <Marker
            colorIndex={m.$point.color}
            legendColorIndex={5}
            active={m.showBlues}
            name="Blues"
            size={m.$point.size}
            x={m.$point.x}
            y={m.$point.y}
            tooltip={{ tpl: "Blue ({$point.x:n;0}, {$point.y:n;0})" }}
            style={{ fillOpacity: 0.5 }}
            draggableX
            draggableY
          />
        </Repeater>
      </Chart>
    </Svg>
    <Legend vertical />
  </div>
);
// @index-end
