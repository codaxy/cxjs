import { createModel } from "cx/data";
import { LabelsTopLayout } from "cx/ui";
import { TextField, ValidationGroup } from "cx/widgets";

// @model
interface Model {
  framework: string;
}

const m = createModel<Model>();
// @model-end

// @index
export default () => (
  <ValidationGroup>
    <LabelsTopLayout vertical>
      <TextField
        label="Favorite framework?"
        value={m.framework}
        validationMode="help-block"
        reactOn="enter blur"
        onValidate={(v) => {
          if (v != "CxJS") return "Oops, wrong answer!";
        }}
      />
    </LabelsTopLayout>
  </ValidationGroup>
);
// @index-end
