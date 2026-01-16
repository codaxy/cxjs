import { createModel } from "cx/data";
import { bind, LabelsLeftLayout } from "cx/ui";
import { Slider } from "cx/widgets";
import { Square } from "./Square";

// @model
interface PageModel {
  red: number;
  green: number;
  blue: number;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default () => (
  <div class="flex gap-8 items-center">
    <LabelsLeftLayout>
      <Slider label="Red" value={bind(m.red, 0)} minValue={0} maxValue={255} />
      <Slider
        label="Green"
        value={bind(m.green, 0)}
        minValue={0}
        maxValue={255}
      />
      <Slider
        label="Blue"
        value={bind(m.blue, 0)}
        minValue={0}
        maxValue={255}
      />
    </LabelsLeftLayout>
    <Square red={m.red} green={m.green} blue={m.blue} />
  </div>
);
// @index-end
