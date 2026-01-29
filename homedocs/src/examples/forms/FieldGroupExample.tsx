import { createModel } from "cx/data";
import { LabelsLeftLayout } from "cx/ui";
import { FieldGroup, TextField, Checkbox, Button } from "cx/widgets";

// @model
interface PageModel {
  enabled: boolean;
  readOnly: boolean;
  viewMode: boolean;
  firstName: string;
  lastName: string;
  active: boolean;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default (
  <div>
    <div className="flex gap-4 mb-4">
      <Checkbox value={m.enabled}>Enabled</Checkbox>
      <Checkbox value={m.readOnly}>Read Only</Checkbox>
      <Checkbox value={m.viewMode}>View Mode</Checkbox>
    </div>
    <FieldGroup
      layout={LabelsLeftLayout}
      enabled={m.enabled}
      readOnly={m.readOnly}
      viewMode={m.viewMode}
    >
      <TextField label="First Name" value={m.firstName} required />
      <TextField label="Last Name" value={m.lastName} required />
      <Checkbox label="Status" value={m.active} text="Active" />
      <Button text="Submit" mod="primary" />
    </FieldGroup>
  </div>
);
// @index-end
