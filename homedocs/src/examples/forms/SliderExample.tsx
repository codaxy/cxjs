import { createModel } from "cx/data";
import { bind, format, LabelsLeftLayout } from "cx/ui";
import { enableTooltips, Slider } from "cx/widgets";

enableTooltips();

// @model
interface Model {
  value: number;
  stepped: number;
  from: number;
  to: number;
}

const m = createModel<Model>();
// @model-end

// @index
export default () => (
  <div class="flex gap-8">
    <LabelsLeftLayout>
      <Slider
        label="Standard"
        value={bind(m.value, 50)}
        wheel
        valueTooltip={{ text: format(m.value, "n;0"), placement: "up" }}
      />
      <Slider label="Stepped" value={bind(m.stepped, 50)} step={10} wheel />
      <Slider label="Range" from={bind(m.from, 25)} to={bind(m.to, 75)} />
      <Slider label="Disabled" value={50} disabled />
    </LabelsLeftLayout>
    <Slider
      vertical
      from={bind(m.from, 25)}
      to={bind(m.to, 75)}
      rangeStyle="background: lightsteelblue"
    />
  </div>
);
// @index-end
