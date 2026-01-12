/** @jsxImportSource cx */
import { LabeledContainer, TextField, DateField } from "cx/widgets";
import { bind, LabelsLeftLayout } from "cx/ui";

export default () => (
  <cx>
    <div layout={LabelsLeftLayout}>
      <LabeledContainer label="Name" trimWhitespace={false}>
        <TextField value={bind("firstName")} placeholder="First Name" />
        <TextField value={bind("lastName")} placeholder="Last Name" />
      </LabeledContainer>
      <LabeledContainer label="Contact" trimWhitespace={false}>
        <TextField value={bind("email")} placeholder="Email" />
        <TextField value={bind("phone")} placeholder="Phone" />
      </LabeledContainer>
      <LabeledContainer label="Date Range" trimWhitespace={false}>
        <DateField value={bind("startDate")} placeholder="Start" />
        <DateField value={bind("endDate")} placeholder="End" />
      </LabeledContainer>
    </div>
  </cx>
);
