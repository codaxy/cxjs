import { createModel } from "cx/data";
import { LabelsTopLayout } from "cx/ui";
import { LabeledContainer, TextField, DateField } from "cx/widgets";

// @model
interface PageModel {
  firstName: string;
  lastName: string;
  startDate: string;
  endDate: string;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default () => (
  <LabelsTopLayout vertical>
    <LabeledContainer label="Full Name">
      <div className="flex gap-2">
        <TextField value={m.firstName} placeholder="First" />
        <TextField value={m.lastName} placeholder="Last" />
      </div>
    </LabeledContainer>
    <LabeledContainer label="Date Range">
      <div className="flex gap-2">
        <DateField value={m.startDate} placeholder="Start" />
        <DateField value={m.endDate} placeholder="End" />
      </div>
    </LabeledContainer>
  </LabelsTopLayout>
);
// @index-end
