import { createModel } from "cx/data";
import { bind, LabelsTopLayout } from "cx/ui";
import { MonthField } from "cx/widgets";

// @model
interface Model {
  month: string;
  from: string;
  to: string;
  placeholder: string;
}

const m = createModel<Model>();
// @model-end

// @index
export default (
  <LabelsTopLayout columns={2}>
    <MonthField label="Single Month" value={bind(m.month, "2024-06-01")} />
    <MonthField
      label="Month Range"
      range
      from={bind(m.from, "2024-03-01")}
      to={bind(m.to, "2024-06-01")}
    />
    <MonthField
      label="Placeholder"
      value={m.placeholder}
      placeholder="Select a month..."
    />
    <MonthField label="Disabled" value={m.month} disabled />
  </LabelsTopLayout>
);
// @index-end
