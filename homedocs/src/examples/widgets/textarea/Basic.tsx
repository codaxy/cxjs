/** @jsxImportSource cx */
import { TextArea } from "cx/widgets";
import { bind } from "cx/ui";

export default () => (
  <cx>
    <TextArea value={bind("text")} rows={3} style="width: 100%" />
  </cx>
);
