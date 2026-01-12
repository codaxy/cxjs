import { createAccessorModelProxy } from "cx/data";
import { LabelsTopLayout } from "cx/ui";
import { TextField, Select } from "cx/widgets";

// @model
interface FormModel {
  title: string;
  firstName: string;
  lastName: string;
}

const m = createAccessorModelProxy<FormModel>();
// @model-end

// @index
export default () => (
  <LabelsTopLayout vertical>
    <Select value={m.title} label="Title" style={{ width: "70px" }}>
      <option value="Mr">Mr.</option>
      <option value="Mrs">Mrs.</option>
    </Select>
    <TextField value={m.firstName} label="First Name" style={{ width: "150px" }} />
    <TextField value={m.lastName} label="Last Name" style={{ width: "150px" }} />
  </LabelsTopLayout>
);
// @index-end
