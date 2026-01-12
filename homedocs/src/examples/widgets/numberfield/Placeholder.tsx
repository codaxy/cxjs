/** @jsxImportSource cx */
import { NumberField } from "cx/widgets";
import { bind } from "cx/ui";

export default () => (
  <cx>
    <NumberField
      value={bind("number")}
      placeholder="Enter a number..."
      style="width: 100%"
    />
  </cx>
);
