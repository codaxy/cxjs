import { createAccessorModelProxy } from "cx/data";
import { bind, LabelsTopLayout } from "cx/ui";
import { TextField } from "cx/widgets";

// @model
interface Model {
  text: string;
  placeholder: string;
}

const m = createAccessorModelProxy<Model>();
// @model-end

// @index
export default () => (
  <LabelsTopLayout columns={2}>
    <TextField label="Standard" value={bind(m.text, "Hello World")} autoFocus />
    <TextField label="Disabled" value={m.text} disabled />
    <TextField label="Read-only" value={m.text} readOnly />
    <TextField label="Placeholder" value={m.placeholder} placeholder="Type something..." />
    <TextField label="Required" value={m.text} required />
    <TextField label="Min/Max Length" value={m.text} minLength={3} maxLength={8} />
  </LabelsTopLayout>
);
// @index-end
