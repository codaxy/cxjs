/** @jsxImportSource cx */
import { TextField } from "cx/widgets";
import { bind, LabelsLeftLayout } from "cx/ui";

export default () => (
  <cx>
    <div layout={LabelsLeftLayout}>
      <TextField label="Email" value={bind("email")} required asterisk />
    </div>
  </cx>
);
