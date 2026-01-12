/** @jsxImportSource cx */
import { FieldGroup, TextField, Checkbox, Button } from "cx/widgets";
import { bind, LabelsLeftLayout } from "cx/ui";

export default () => (
  <cx>
    <div>
      <div style="display: flex; gap: 16px; margin-bottom: 16px;">
        <Checkbox value={bind("enabled")}>Enabled</Checkbox>
        <Checkbox value={bind("readOnly")}>Read Only</Checkbox>
        <Checkbox value={bind("viewMode")}>View Mode</Checkbox>
      </div>
      <FieldGroup
        layout={LabelsLeftLayout}
        enabled={bind("enabled")}
        readOnly={bind("readOnly")}
        viewMode={bind("viewMode")}
      >
        <TextField label="First Name" value={bind("firstName")} required />
        <TextField label="Last Name" value={bind("lastName")} required />
        <Checkbox label="Status" value={bind("active")} text="Active" />
        <Button text="Submit" mod="primary" />
      </FieldGroup>
    </div>
  </cx>
);
