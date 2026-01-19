/** @jsxImportSource cx */
import { Svg } from "cx/svg";
import { PieChart, PieSlice, Legend, ColorMap } from "cx/charts";
import { Repeater, Controller } from "cx/ui";

class PageController extends Controller {
  onInit() {
    this.store.set("slices", [
      { name: "Electronics", value: 35 },
      { name: "Clothing", value: 25 },
      { name: "Food", value: 20 },
      { name: "Books", value: 12 },
      { name: "Other", value: 8 },
    ]);
  }
}

export default () => (
  <cx>
    <div controller={PageController}>
      <Legend />
      <Svg style="width: 100%; height: 300px;">
        <ColorMap />
        <PieChart>
          <Repeater records-bind="slices">
            <PieSlice
              value-bind="$record.value"
              colorMap="pie"
              r={90}
              r0={40}
              name-bind="$record.name"
              tooltip-tpl="{$record.name}: {$record.value}%"
            />
          </Repeater>
        </PieChart>
      </Svg>
    </div>
  </cx>
);
