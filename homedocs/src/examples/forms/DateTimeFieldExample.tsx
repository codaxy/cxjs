import { createModel } from "cx/data";
import { bind, LabelsTopLayout } from "cx/ui";
import { DateTimeField, TimeField } from "cx/widgets";

// @model
interface Model {
  datetime: string;
  time: string;
  placeholder: string;
}

const m = createModel<Model>();
// @model-end

// @index
export default (
  <LabelsTopLayout columns={2}>
    <DateTimeField label="Date & Time" value={bind(m.datetime, "2024-06-15T14:30:00")} autoFocus />
    <DateTimeField label="Time (segment)" value={bind(m.time, "2024-06-15T14:30:00")} segment="time" />
    <TimeField label="TimeField alias" value={m.time} />
    <TimeField label="List picker" value={m.time} picker="list" step={15} />
    <DateTimeField label="Placeholder" value={m.placeholder} placeholder="Select date & time..." />
    <DateTimeField label="Disabled" value={m.datetime} disabled />
  </LabelsTopLayout>
);
// @index-end
