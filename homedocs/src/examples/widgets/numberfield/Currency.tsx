/** @jsxImportSource cx */
import { NumberField } from "cx/widgets";
import { bind } from "cx/ui";

export default () => (
  <cx>
    <NumberField
      value={bind("price")}
      format="currency;EUR"
      placeholder="Price"
      style="width: 100%"
    />
  </cx>
);
