/** @jsxImportSource cx */
import { Slider } from "cx/widgets";
import { bind } from "cx/ui";

export default () => (
  <cx>
    <Slider value={bind("volume")} style="width: 100%" />
  </cx>
);
