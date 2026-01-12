/** @jsxImportSource cx */
import { MonthField } from "cx/widgets";
import { bind } from "cx/ui";

export default () => (
  <cx>
    <MonthField
      range
      from={bind("fromMonth")}
      to={bind("toMonth")}
      style="width: 100%"
    />
  </cx>
);
