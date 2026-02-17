import { createModel } from "cx/data";
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
  <div>
    First some text.
    <TextField value={m.text} label="Label 1" />
    <Checkbox value={m.check} label="Label 2">
      Checkbox
    </Checkbox>
  </div>
);
// @index-end
