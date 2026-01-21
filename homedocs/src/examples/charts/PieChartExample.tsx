import { Svg, Text, Rectangle, Line } from "cx/svg";
import { PieChart, PieSlice, Legend, ColorMap } from "cx/charts";
import { createModel } from "cx/data";
import { Controller, Repeater, LabelsTopLayout, KeySelection } from "cx/ui";
import { enableTooltips, Slider } from "cx/widgets";

enableTooltips();

// @model
interface Slice {
  id: number;
  name: string;
  value: number;
  active: boolean;
}

interface Model {
  data: Slice[];
  $record: Slice;
  $index: number;
  selection: number | null;
  angle: number;
  gap: number;
  r0: number;
  borderRadius: number;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller<typeof m> {
  onInit() {
    this.store.set(m.angle, 360);
    this.store.set(m.gap, 4);
    this.store.set(m.r0, 50);
    this.store.set(m.borderRadius, 5);
    this.store.set(m.data, [
      { id: 0, name: "Electronics", value: 35, active: true },
      { id: 1, name: "Clothing", value: 25, active: true },
      { id: 2, name: "Food", value: 20, active: true },
      { id: 3, name: "Books", value: 12, active: true },
      { id: 4, name: "Other", value: 8, active: true },
    ]);
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController}>
    <Legend />
    <Svg style="width: 100%; height: 350px">
      <ColorMap />
      <PieChart angle={m.angle} gap={m.gap}>
        <Repeater records={m.data}>
          <PieSlice
            value={m.$record.value}
            active={m.$record.active}
            colorMap="pie"
            r={80}
            r0={m.r0}
            borderRadius={m.borderRadius}
            name={m.$record.name}
            innerPointRadius={80}
            outerPointRadius={90}
            tooltip={{ text: { tpl: "{$record.name}: {$record.value}%" }, trackMouse: true }}
            selection={{
              type: KeySelection,
              bind: m.selection,
              record: m.$record,
              index: m.$index,
              keyField: "id",
            }}
          >
            <Line style="stroke: gray" />
            <Rectangle anchors="1 1 1 1" offset="-10 20 10 -20" style="fill: white; stroke: gray">
              <Text tpl="{$record.value:n;0}%" dy="0.4em" ta="middle" />
            </Rectangle>
          </PieSlice>
        </Repeater>
      </PieChart>
    </Svg>
    <LabelsTopLayout columns={2} mod={["stretch", "fixed"]}>
      <Slider value={m.angle} minValue={30} maxValue={360} label="Angle" help={{ tpl: "{angle:n;0}°" }} />
      <Slider value={m.gap} minValue={0} maxValue={20} label="Gap" help={{ tpl: "{gap:n;0}px" }} />
      <Slider value={m.r0} minValue={0} maxValue={70} label="Inner Radius" help={{ tpl: "{r0:n;0}%" }} />
      <Slider value={m.borderRadius} minValue={0} maxValue={20} label="Border Radius" help={{ tpl: "{borderRadius:n;0}px" }} />
    </LabelsTopLayout>
  </div>
);
// @index-end
