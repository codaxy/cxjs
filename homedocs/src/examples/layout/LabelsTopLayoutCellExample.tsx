import { createAccessorModelProxy } from "cx/data";
import { LabelsTopLayout, LabelsTopLayoutCell } from "cx/ui";
import { TextField, TextArea } from "cx/widgets";

// @model
interface FormModel {
  field1: string;
  field2: string;
  field3: string;
  notes: string;
}

const m = createAccessorModelProxy<FormModel>();
// @model-end

// @index
export default () => (
  <LabelsTopLayout columns={3}>
    <TextField label="Field 1" value={m.field1} />
    <TextField label="Field 2" value={m.field2} />
    <TextField label="Field 3" value={m.field3} />
    <LabelsTopLayoutCell colSpan={3}>
      <TextArea label="Notes" value={m.notes} rows={3} style={{ width: "100%" }} />
    </LabelsTopLayoutCell>
  </LabelsTopLayout>
);
// @index-end
