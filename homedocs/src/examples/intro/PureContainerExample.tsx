import { createModel } from "cx/data";
import { LabelsTopLayout, PureContainer } from "cx/ui";
import { Checkbox, TextField } from "cx/widgets";

interface Model {
  showContactInfo: boolean;
  email: string;
  phone: string;
}

const m = createModel<Model>();

// @model
export const model = {
  showContactInfo: true,
  email: "",
  phone: "",
};
// @model-end

// @index
export default (
  <div>
    <Checkbox value={m.showContactInfo}>Show contact information</Checkbox>
    <PureContainer visible={m.showContactInfo}>
      <div class="mt-2 font-bold">Contact Information</div>
      <LabelsTopLayout>
        <TextField value={m.email} label="Email" />
        <TextField value={m.phone} label="Phone" />
      </LabelsTopLayout>
      <p className="text-gray-500 text-sm mt-4">
        We'll never share your contact information.
      </p>
    </PureContainer>
  </div>
);
// @index-end
