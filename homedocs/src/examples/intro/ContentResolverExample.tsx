import { createModel } from "cx/data";
import {
  Checkbox,
  ContentResolver,
  DateField,
  LookupField,
  Switch,
  TextField,
} from "cx/widgets";

// @model

interface Model {
  fieldType: string;
  text: string;
  date: string;
  checked: boolean;
}

const m = createModel<Model>();

const fieldTypes = [
  { id: "textfield", text: "TextField" },
  { id: "datefield", text: "DateField" },
  { id: "checkbox", text: "Checkbox" },
  { id: "switch", text: "Switch" },
];

// @model-end
// @index
export default (
  <div className="flex items-center gap-4">
    <LookupField value={m.fieldType} options={fieldTypes} label="Field Type" />
    <ContentResolver
      params={m.fieldType}
      onResolve={(type) => {
        switch (type) {
          case "textfield":
            return <TextField value={m.text} />;
          case "datefield":
            return <DateField value={m.date} />;
          case "checkbox":
            return <Checkbox value={m.checked}>Checked</Checkbox>;
          case "switch":
            return <Switch value={m.checked} />;
          default:
            return null;
        }
      }}
    />
  </div>
);
// @index-end
