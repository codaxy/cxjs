/** @jsxImportSource cx */
import { MonthField } from "cx/widgets";
import { bind, LabelsLeftLayout } from "cx/ui";

export default () => (
  <cx>
    <div layout={LabelsLeftLayout}>
      <MonthField label="Single Month" value={bind("month")} />
      <MonthField
        label="Month Range"
        range
        from={bind("fromMonth")}
        to={bind("toMonth")}
      />
      <MonthField label="Disabled" value={bind("month")} disabled />
    </div>
  </cx>
);
