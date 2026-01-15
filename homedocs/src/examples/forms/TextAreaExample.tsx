import { createAccessorModelProxy } from "cx/data";
import { bind, LabelsTopLayout } from "cx/ui";
import { TextArea } from "cx/widgets";

// @model
interface Model {
  text: string;
  placeholder: string;
}

const m = createAccessorModelProxy<Model>();
// @model-end

// @index
export default () => (
  <LabelsTopLayout vertical>
    <TextArea label="Standard" value={bind(m.text, "Hello World\nThis is a multi-line text.")} rows={3} />
    <TextArea label="Disabled" value={m.text} rows={3} disabled />
    <TextArea label="Placeholder" value={m.placeholder} rows={3} placeholder="Enter your message..." />
    <TextArea label="Required" value={m.text} rows={3} required />
  </LabelsTopLayout>
);
// @index-end
