/** @jsxImportSource cx */
import { LabeledContainer, DateField } from "cx/widgets";
import { bind, LabelsLeftLayout } from "cx/ui";

export default () => (
  <cx>
    <div layout={LabelsLeftLayout}>
      <LabeledContainer label="Date Range">
        <DateField value={bind("startDate")} placeholder="Start" />
        <DateField value={bind("endDate")} placeholder="End" />
      </LabeledContainer>
    </div>
  </cx>
);
