/** @jsxImportSource cx */
import { Svg, Text, Line, Rectangle } from "cx/svg";
import {
  PieChart,
  PieSlice,
  PieLabelsContainer,
  PieLabel,
  ColorMap,
  Legend,
} from "cx/charts";
import { Repeater, Controller } from "cx/ui";

class PageController extends Controller {
  onInit() {
    this.store.set(
      "points",
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        name: `Item ${i + 1}`,
        value: 15 + Math.random() * 35,
        active: true,
      })),
    );
  }
}

export default () => (
  <cx>
    <div controller={PageController}>
      <Legend />
      <Svg style="width: 100%; height: 350px;">
        <ColorMap />
        <PieLabelsContainer>
          <PieChart>
            <Repeater records-bind="points">
              <PieSlice
                value-bind="$record.value"
                active-bind="$record.active"
                colorMap="pie"
                r={70}
                r0={25}
                offset={4}
                innerPointRadius={70}
                outerPointRadius={80}
                name-bind="$record.name"
              >
                <Line style="stroke: gray" />
                <PieLabel
                  anchors="1 1 1 1"
                  offset="-10 40 10 -40"
                  distance={50}
                  lineStroke="gray"
                >
                  <Text tpl="{$record.name}" dy="0.37em" textAnchor="middle" />
                </PieLabel>
              </PieSlice>
            </Repeater>
          </PieChart>
        </PieLabelsContainer>
      </Svg>
    </div>
  </cx>
);
