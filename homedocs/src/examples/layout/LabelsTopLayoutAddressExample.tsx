import { createModel } from "cx/data";
import { LabelsTopLayout } from "cx/ui";
import { TextField } from "cx/widgets";

// @model
interface AddressModel {
  street: string;
  city: string;
  zip: string;
}

const m = createModel<AddressModel>();
// @model-end

// @index
export default (
  <LabelsTopLayout>
    <TextField
      value={m.street}
      label="Address"
      placeholder="Street"
      style={{ width: "150px" }}
    />
    <TextField value={m.city} placeholder="City" style={{ width: "150px" }} />
    <TextField value={m.zip} placeholder="Zip" style={{ width: "70px" }} />
  </LabelsTopLayout>
);
// @index-end
