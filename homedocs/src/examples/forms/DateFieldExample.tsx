import { createModel } from "cx/data";
import { bind, LabelsTopLayout } from "cx/ui";
import { DateField } from "cx/widgets";

// @model
interface Model {
  date: string;
  placeholder: string;
}

const m = createModel<Model>();
// @model-end

// @index
export default (
  <LabelsTopLayout columns={2}>
    <DateField label="Standard" value={bind(m.date, "2024-06-15")} />
    <DateField label="Disabled" value={m.date} disabled />
    <DateField label="Read-only" value={m.date} readOnly />
    <DateField
      label="Placeholder"
      value={m.placeholder}
      placeholder="Select a date..."
    />
    <DateField label="Required" value={m.date} required />
    <DateField
      label="Weekends Disabled"
      value={m.date}
      disabledDaysOfWeek={[0, 6]}
    />
  </LabelsTopLayout>
);
// @index-end
