import { createModel } from "cx/data";
import { LabelsTopLayout } from "cx/ui";
import { TextField } from "cx/widgets";

// @model
interface FormModel {
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
  field6: string;
}

const m = createModel<FormModel>();
// @model-end

// @index
export default (
  <LabelsTopLayout columns={3}>
    <TextField label="Field 1" value={m.field1} />
    <TextField label="Field 2" value={m.field2} />
    <TextField label="Field 3" value={m.field3} />
    <TextField label="Field 4" value={m.field4} />
    <TextField label="Field 5" value={m.field5} />
    <TextField label="Field 6" value={m.field6} />
  </LabelsTopLayout>
);
// @index-end
