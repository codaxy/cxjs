/** @jsxImportSource cx */
import { NumberField } from "cx/widgets";
import { bind, LabelsLeftLayout } from "cx/ui";

export default () => (
  <cx>
    <div layout={LabelsLeftLayout}>
      <NumberField label="Standard" value={bind("number")} />
      <NumberField label="Disabled" value={bind("number")} disabled />
      <NumberField label="Readonly" value={bind("number")} readOnly />
      <NumberField
        label="Placeholder"
        value={bind("number2")}
        placeholder="Enter a number..."
      />
      <NumberField
        label="Min Value"
        value={bind("number3")}
        minValue={18}
        placeholder="Min 18"
      />
      <NumberField
        label="Currency (EUR)"
        value={bind("currency")}
        format="currency;EUR"
      />
      <NumberField
        label="Percentage"
        value={bind("percent")}
        scale={0.01}
        format="p"
      />
      <NumberField label="Required" value={bind("required")} required />
    </div>
  </cx>
);
