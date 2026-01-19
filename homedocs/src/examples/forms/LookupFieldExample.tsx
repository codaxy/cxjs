import { createModel } from "cx/data";
import { bind, LabelsTopLayout } from "cx/ui";
import { LookupField } from "cx/widgets";

// @model
interface Model {
  selectedId: number;
  selectedText: string;
  selectedRecords: { id: number; text: string }[];
}

const m = createModel<Model>();

const options = [
  { id: 1, text: "Apple" },
  { id: 2, text: "Banana" },
  { id: 3, text: "Cherry" },
  { id: 4, text: "Date" },
  { id: 5, text: "Elderberry" },
];
// @model-end

// @index
export default () => (
  <LabelsTopLayout columns={2}>
    <LookupField
      label="Single Select"
      value={bind(m.selectedId, 1)}
      text={bind(m.selectedText, "Apple")}
      options={options}
    />
    <LookupField label="Multiple Select" records={m.selectedRecords} options={options} multiple />
  </LabelsTopLayout>
);
// @index-end
