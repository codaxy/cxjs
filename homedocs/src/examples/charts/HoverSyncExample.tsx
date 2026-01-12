/** @jsxImportSource cx */
import { Svg } from "cx/svg";
import {
  Chart,
  NumericAxis,
  CategoryAxis,
  Gridlines,
  Bar,
  PieChart,
  PieSlice,
  ColorMap,
  Legend,
} from "cx/charts";
import { Repeater, Controller, HoverSync } from "cx/ui";

class PageController extends Controller {
  onInit() {
    let value = 100;
    this.store.set(
      "points",
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        name: `Item ${i + 1}`,
        value: (value = value + (Math.random() - 0.5) * 30),
      })),
    );
  }
}

export default () => (
  <cx>
    <div controller={PageController}>
      <HoverSync>
        <Legend />
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <Svg style="width: 180px; height: 180px;">
            <ColorMap />
            <PieChart>
              <Repeater records-bind="points">
                <PieSlice
                  value-bind="$record.value"
                  colorMap="pie"
                  r={70}
                  r0={25}
                  offset={4}
                  hoverId-bind="$record.id"
                  name-bind="$record.name"
                />
              </Repeater>
            </PieChart>
          </Svg>
          <Svg style="flex: 1; min-width: 250px; height: 180px;">
            <Chart
              margin="10 10 30 60"
              axes={{
                x: { type: NumericAxis, snapToTicks: 0 },
                y: { type: CategoryAxis, vertical: true, inverted: true },
              }}
            >
              <Gridlines />
              <Repeater records-bind="points">
                <Bar
                  name-bind="$record.name"
                  x-bind="$record.value"
                  y-bind="$record.name"
                  colorMap="pie"
                  hoverId-bind="$record.id"
                  height={0.6}
                />
              </Repeater>
            </Chart>
          </Svg>
        </div>
      </HoverSync>
      <p style="text-align: center; color: #666; margin-top: 8px; font-size: 12px;">
        Hover over pie slices or bars to see synchronized highlighting
      </p>
    </div>
  </cx>
);
