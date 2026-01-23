import { createModel } from "cx/data";
import { Controller, Repeater } from "cx/ui";
import {
  Svg,
  Rectangle,
  Text,
  NonOverlappingRect,
  NonOverlappingRectGroup,
} from "cx/svg";
import { Chart, Gridlines, Marker, NumericAxis } from "cx/charts";

// @model
interface Point {
  x: number;
  y: number;
}

interface Model {
  data: Point[];
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(
      m.data,
      Array.from({ length: 30 }, () => ({
        x: 100 + Math.random() * 300,
        y: Math.random() * 300,
      })),
    );
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <Svg style="width: 500px; height: 400px; border: 1px dashed #ddd">
      <Chart
        offset="50 -30 -40 50"
        axes={{
          x: { type: NumericAxis, snapToTicks: 1 },
          y: { type: NumericAxis, vertical: true, snapToTicks: 1 },
        }}
      >
        <NonOverlappingRectGroup>
          <Gridlines />
          <Repeater records={m.data} recordName="$point">
            <Marker
              colorIndex={0}
              size={10}
              x={{ bind: "$point.x" }}
              y={{ bind: "$point.y" }}
              style={{ fillOpacity: 0.5 }}
              draggableX
              draggableY
            >
              <NonOverlappingRect offset="-15 25 0 -25" anchors="0 0.5 0 0.5">
                <Rectangle
                  style="fill: white; stroke: red; stroke-width: 0.5"
                  anchors="0 1 1 0"
                  rx={3}
                >
                  <Text
                    value={{ tpl: "{$point.x:n;0}, {$point.y:n;0}" }}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style="font-size: 10px"
                  />
                </Rectangle>
              </NonOverlappingRect>
            </Marker>
          </Repeater>
        </NonOverlappingRectGroup>
      </Chart>
    </Svg>
  </div>
);
// @index-end
