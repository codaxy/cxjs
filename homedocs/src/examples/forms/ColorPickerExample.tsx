import { createModel } from "cx/data";
import { ColorPicker } from "cx/widgets";

// @model
interface Model {
  color: string;
}

const m = createModel<Model>();
// @model-end

// @index
export default () => (
  <div class="flex flex-wrap gap-4 items-start">
    <ColorPicker value={m.color} />
    <div
      class="w-24 h-24 rounded border border-gray-300"
      style={{ background: m.color }}
    />
  </div>
);
// @index-end
