/** @jsxImportSource cx */
import { NumberField } from "cx/widgets";
import { bind } from "cx/ui";

export default () => (
  <cx>
    <NumberField
      value={bind("percent")}
      scale={0.01}
      format="p"
      placeholder="Percentage"
      style="width: 100%"
    />
  </cx>
);
