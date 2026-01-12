/** @jsxImportSource cx */
import { Slider } from "cx/widgets";
import { bind } from "cx/ui";

export default () => (
  <cx>
    <Slider
      value={bind("value")}
      minValue={20}
      maxValue={80}
      style="width: 100%"
    />
  </cx>
);
