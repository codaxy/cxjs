import { createModel } from "cx/data";
import { bind, LabelsTopLayout } from "cx/ui";
import { Checkbox } from "cx/widgets";

// @model
interface Model {
  checked: boolean;
  indeterminate: boolean;
}

const m = createModel<Model>();
// @model-end

// @index
export default (
  <LabelsTopLayout columns={2}>
    <Checkbox label="Standard" value={bind(m.checked, true)} text="I agree to terms" />
    <Checkbox label="Native" value={m.checked} text="I agree to terms" native />
    <Checkbox label="Disabled" value={m.checked} text="I agree to terms" disabled />
    <Checkbox label="Read-only" value={m.checked} text="I agree to terms" readOnly />
    <Checkbox label="Required" value={m.checked} text="I agree to terms" required />
    <Checkbox label="Three State" value={m.indeterminate} text="Select all" indeterminate />
  </LabelsTopLayout>
);
// @index-end
