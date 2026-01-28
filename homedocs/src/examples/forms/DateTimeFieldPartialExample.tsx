import { createModel } from "cx/data";
import { bind, LabelsTopLayout } from "cx/ui";
import { DateField, TimeField } from "cx/widgets";

// @model
interface Model {
  datetime: string;
}

const m = createModel<Model>();
// @model-end

// @index
export default (
  <LabelsTopLayout columns={2}>
    <DateField label="Date" value={bind(m.datetime, "2024-06-15T14:30:00")} partial />
    <TimeField label="Time" value={m.datetime} partial />
  </LabelsTopLayout>
);
// @index-end
