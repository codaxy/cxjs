import { createModel } from "cx/data";
import { expr, LabelsTopLayout } from "cx/ui";
import { Button, MsgBox, TextField, ValidationGroup } from "cx/widgets";

// @model
interface Model {
  data: {
    firstName: string;
    lastName: string;
    email: string;
  };
  valid: boolean;
  visited: boolean;
}

const m = createModel<Model>();
// @model-end

// @index
export default (
  <div class="flex flex-col gap-4">
    <ValidationGroup valid={m.valid} visited={m.visited} asterisk>
      <LabelsTopLayout vertical>
        <TextField label="First Name" value={m.data.firstName} required />
        <TextField label="Last Name" value={m.data.lastName} required />
        <TextField label="Email" value={m.data.email} required />
      </LabelsTopLayout>
    </ValidationGroup>
    <div class="flex items-center gap-4">
      <Button
        onClick={(e, { store }) => {
          if (!store.get(m.valid)) {
            store.set(m.visited, true);
            return;
          }
          MsgBox.alert("Form submitted successfully!");
        }}
      >
        Submit
      </Button>
      <span
        class="text-sm"
        text={expr(m.valid, (v) =>
          v ? "Form is valid ✓" : "Please fill all required fields",
        )}
      />
    </div>
  </div>
);
// @index-end
