/** @jsxImportSource cx */
import { TextArea } from "cx/widgets";

export default () => (
  <cx>
    <TextArea
      value="This text cannot be edited"
      disabled
      rows={2}
      style="width: 100%"
    />
  </cx>
);
