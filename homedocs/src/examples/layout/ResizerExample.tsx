import { createModel } from "cx/data";
import { format } from "cx/ui";
import { Resizer } from "cx/widgets";

interface Model {
  leftWidth: number;
}

const m = createModel<Model>();

// @model
export const model = {
  leftWidth: 200,
};
// @model-end

// @index
export default () => (
  <div className="flex h-[150px] border border-gray-300">
    <div
      className="p-4"
      style={{ width: format(m.leftWidth, "n;0:suffix;px") }}
    >
      Left panel (drag the resizer)
    </div>
    <Resizer
      size={m.leftWidth}
      minSize={100}
      maxSize={400}
      className="border-x border-gray-300"
    />
    <div className="flex-1 p-4">Right panel</div>
  </div>
);
// @index-end
