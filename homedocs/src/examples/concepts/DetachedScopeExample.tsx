import { createAccessorModelProxy } from "cx/data";
import { DetachedScope } from "cx/widgets";

interface Model {
  scope1: { count: number };
  scope2: { count: number };
}

const m = createAccessorModelProxy<Model>();

// @model
export const model = {
  scope1: { count: 0 },
  scope2: { count: 0 },
};
// @model-end

// @index
export default () => (
  <div className="flex gap-4">
    <DetachedScope bind={m.scope1}>
      <div className="p-4 bg-gray-100 rounded">
        <p>Detached Scope 1</p>
        <p text={m.scope1.count} />
      </div>
    </DetachedScope>

    <DetachedScope bind={m.scope2}>
      <div className="p-4 bg-gray-100 rounded">
        <p>Detached Scope 2</p>
        <p text={m.scope2.count} />
      </div>
    </DetachedScope>
  </div>
);
// @index-end
