import { createModel } from "cx/data";
import { LabelsLeftLayout } from "cx/ui";
import { TextField, Checkbox } from "cx/widgets";

// @model
interface FormModel {
  text: string;
  check: boolean;
}

const m = createModel<FormModel>();
// @model-end

// @index
export default (
  <LabelsLeftLayout>
    First some text.
    <TextField value={m.text} label="Label 1" />
    <Checkbox value={m.check} label="Label 2">
      Checkbox
    </Checkbox>
  </LabelsLeftLayout>
);
// @index-end
