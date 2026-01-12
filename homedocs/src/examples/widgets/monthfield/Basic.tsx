/** @jsxImportSource cx */
import { MonthField } from "cx/widgets";
import { bind } from "cx/ui";

export default () => (
  <cx>
    <MonthField value={bind("month")} style="width: 100%" />
  </cx>
);
