import { createModel } from "cx/data";
import { IsolatedScope } from "cx/widgets";

interface Model {
  scope1: { count: number };
  scope2: { count: number };
}

const m = createModel<Model>();

// @model
export const model = {
  scope1: { count: 0 },
  scope2: { count: 0 },
};
// @model-end

// @index
export default (
  <div className="flex gap-4">
    <IsolatedScope bind={m.scope1}>
      <div className="p-4 bg-gray-100 rounded">
        <p>Isolated Scope 1</p>
        <p text={m.scope1.count} />
      </div>
    </IsolatedScope>

    <IsolatedScope bind={m.scope2}>
      <div className="p-4 bg-gray-100 rounded">
        <p>Isolated Scope 2</p>
        <p text={m.scope2.count} />
      </div>
    </IsolatedScope>
  </div>
);
// @index-end
