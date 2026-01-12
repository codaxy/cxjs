/** @jsxImportSource cx */
import { NumberField } from "cx/widgets";
import { bind } from "cx/ui";

export default () => (
  <cx>
    <NumberField
      value={bind("age")}
      minValue={0}
      maxValue={120}
      placeholder="Age (0-120)"
      style="width: 100%"
    />
  </cx>
);
