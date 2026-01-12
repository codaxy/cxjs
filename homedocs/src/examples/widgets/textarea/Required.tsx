/** @jsxImportSource cx */
import { TextArea } from "cx/widgets";
import { bind } from "cx/ui";

export default () => (
  <cx>
    <TextArea value={bind("text")} required rows={2} style="width: 100%" />
  </cx>
);
