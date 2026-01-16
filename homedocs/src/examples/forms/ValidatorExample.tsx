import { createModel } from "cx/data";
import { LabelsTopLayout } from "cx/ui";
import { ValidationGroup, TextField, Validator, ValidationError } from "cx/widgets";

// @model
interface Model {
  password: string;
  confirmPassword: string;
  valid: boolean;
}

const m = createModel<Model>();
// @model-end

// @index
export default () => (
  <ValidationGroup valid={m.valid} visited>
    <LabelsTopLayout vertical>
      <TextField label="Password" value={m.password} inputType="password" required />
      <TextField label="Confirm Password" value={m.confirmPassword} inputType="password" required />
      <Validator
        value={{ password: m.password, confirmPassword: m.confirmPassword }}
        onValidate={(value) => {
          if (value.password !== value.confirmPassword)
            return "Passwords do not match";
        }}
      >
        <div class="mt-2">
          <ValidationError class="px-3 py-2 bg-red-100 text-red-600 rounded" />
        </div>
      </Validator>
    </LabelsTopLayout>
  </ValidationGroup>
);
// @index-end
