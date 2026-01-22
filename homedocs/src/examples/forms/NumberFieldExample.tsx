import { createModel } from "cx/data";
import { bind, LabelsTopLayout } from "cx/ui";
import { NumberField } from "cx/widgets";

// @model
interface Model {
  number: number;
  placeholder: number;
}

const m = createModel<Model>();
// @model-end

// @index
export default (
  <LabelsTopLayout columns={2}>
    <NumberField label="Standard" value={bind(m.number, 1234.5)} autoFocus />
    <NumberField label="Disabled" value={m.number} disabled />
    <NumberField label="Read-only" value={m.number} readOnly />
    <NumberField label="Placeholder" value={m.placeholder} placeholder="Enter a number..." />
    <NumberField label="Required" value={m.number} required />
    <NumberField label="Min/Max (0-100)" value={m.number} minValue={0} maxValue={100} />
  </LabelsTopLayout>
);
// @index-end
