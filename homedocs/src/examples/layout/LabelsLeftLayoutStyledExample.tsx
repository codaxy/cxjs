import { createAccessorModelProxy } from "cx/data";
import { LabelsLeftLayout } from "cx/ui";
import { TextField, NumberField, TextArea } from "cx/widgets";

// @model
interface FormModel {
  name: string;
  email: string;
  age: number;
  bio: string;
}

const m = createAccessorModelProxy<FormModel>();
// @model-end

// @index
export default () => (
  <LabelsLeftLayout>
    <TextField value={m.name} label="Name" />
    <TextField value={m.email} label="Email" />
    <NumberField value={m.age} label="Age" />
    <TextArea value={m.bio} label="Bio" rows={3} />
  </LabelsLeftLayout>
);
// @index-end
