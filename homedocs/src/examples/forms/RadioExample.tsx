import { createModel } from "cx/data";
import { bind } from "cx/ui";
import { Radio } from "cx/widgets";

// @model
interface Model {
  size: string;
}

const m = createModel<Model>();
// @model-end

// @index
export default () => (
  <div style="display: flex; flex-direction: column; gap: 8px">
    <Radio value={m.size} option="small" text="Small" default />
    <Radio value={m.size} option="medium" text="Medium" />
    <Radio value={m.size} option="large" text="Large" />
    <Radio value={m.size} option="disabled" text="Disabled Option" disabled />
  </div>
);
// @index-end
