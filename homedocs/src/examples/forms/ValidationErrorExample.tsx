import { createModel } from "cx/data";
import { LabelsTopLayout } from "cx/ui";
import { DateField, Validator, ValidationError } from "cx/widgets";

// @model
interface Model {
  startDate: string;
  endDate: string;
}

const m = createModel<Model>();
// @model-end

// @index
export default (
  <LabelsTopLayout vertical>
    <DateField label="Start Date" value={m.startDate} required />
    <DateField label="End Date" value={m.endDate} required />
    <Validator
      value={{ start: m.startDate, end: m.endDate }}
      onValidate={(value) => {
        if (value.start && value.end && value.start > value.end)
          return "End date must be after start date";
      }}
      visited
    >
      <ValidationError class="block mt-2 px-3 py-2 bg-red-100 text-red-600 rounded text-sm" />
    </Validator>
  </LabelsTopLayout>
);
// @index-end
