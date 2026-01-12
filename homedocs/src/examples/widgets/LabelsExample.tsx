/** @jsxImportSource cx */
import { TextField, Checkbox, enableTooltips } from "cx/widgets";
import { bind, LabelsLeftLayout } from "cx/ui";

enableTooltips();

export default () => (
  <cx>
    <div layout={LabelsLeftLayout}>
      <TextField label="Standard" value={bind("text")} />
      <TextField
        label={{ text: "Styled", style: "color:green;font-weight:bold" }}
        value={bind("text")}
      />
      <TextField label="Asterisk" value={bind("text")} required asterisk />
      <TextField
        label={
          <cx>
            <Checkbox value={bind("enabled")}>Enabled</Checkbox>
          </cx>
        }
        value={bind("text")}
        enabled={bind("enabled")}
      />
      <TextField
        label={{
          text: "With Tooltip",
          tooltip: "This tooltip is on the label",
        }}
        value={bind("text")}
        tooltip="This tooltip is on the field"
      />
    </div>
  </cx>
);
