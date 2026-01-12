/** @jsxImportSource cx */
import { TextField } from "cx/widgets";
import { bind, LabelsLeftLayout } from "cx/ui";

export default () => (
  <cx>
    <div layout={LabelsLeftLayout}>
      <TextField label="Name" value={bind("name")} />
    </div>
  </cx>
);
