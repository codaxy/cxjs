/** @jsxImportSource cx */
import { Slider } from "cx/widgets";
import { bind } from "cx/ui";

export default () => (
  <cx>
    <Slider value={bind("stepped")} step={10} style="width: 100%" />
  </cx>
);
