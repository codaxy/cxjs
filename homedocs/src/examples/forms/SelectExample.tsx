import { createModel } from "cx/data";
import { bind, LabelsTopLayout } from "cx/ui";
import { enableTooltips, Select } from "cx/widgets";

enableTooltips();

// @model
interface Model {
  selection: number;
  clearable: number;
}

const m = createModel<Model>();
// @model-end

// @index
export default () => (
  <LabelsTopLayout columns={2}>
    <Select label="Standard" value={bind(m.selection, 1)}>
      <option value={1}>Option 1</option>
      <option value={2}>Option 2</option>
    </Select>
    <Select label="Disabled" value={m.selection} disabled>
      <option value={1}>Option 1</option>
      <option value={2}>Option 2</option>
    </Select>
    <Select label="Required" value={m.clearable} required placeholder="Select...">
      <option value={1}>Option 1</option>
      <option value={2}>Option 2</option>
    </Select>
    <Select label="With Tooltip" value={m.selection} tooltip="This is a tooltip">
      <option value={1}>Option 1</option>
      <option value={2}>Option 2</option>
    </Select>
    <Select label="Styled with Icon" value={m.selection} inputStyle={{ border: "1px solid green" }} icon="search">
      <option value={1}>Option 1</option>
      <option value={2}>Option 2</option>
    </Select>
    <Select label="Clearable" value={m.clearable} placeholder="Please select...">
      <option value={1}>Option 1</option>
      <option value={2}>Option 2</option>
    </Select>
  </LabelsTopLayout>
);
// @index-end
