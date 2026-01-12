/** @jsxImportSource cx */
import { TextArea } from "cx/widgets";
import { bind, LabelsLeftLayout } from "cx/ui";

export default () => (
  <cx>
    <div layout={LabelsLeftLayout}>
      <TextArea label="Standard" value={bind("text")} rows={3} />
      <TextArea label="Disabled" value={bind("text")} disabled />
      <TextArea label="Readonly" value={bind("text")} readOnly />
      <TextArea
        label="Placeholder"
        value={bind("text2")}
        placeholder="Type something here..."
      />
      <TextArea label="Required" value={bind("text3")} required />
    </div>
  </cx>
);
