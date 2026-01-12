/** @jsxImportSource cx */
import { Slider } from "cx/widgets";
import { bind } from "cx/ui";

export default () => (
  <cx>
    <Slider from={bind("min")} to={bind("max")} style="width: 100%" />
  </cx>
);
