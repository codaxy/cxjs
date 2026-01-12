/** @jsxImportSource cx */
import { LabeledContainer, TextField } from "cx/widgets";
import { bind, LabelsLeftLayout } from "cx/ui";

export default () => (
  <cx>
    <div layout={LabelsLeftLayout}>
      <LabeledContainer label="Full Name">
        <TextField value={bind("firstName")} placeholder="First" />
        <TextField value={bind("lastName")} placeholder="Last" />
      </LabeledContainer>
    </div>
  </cx>
);
