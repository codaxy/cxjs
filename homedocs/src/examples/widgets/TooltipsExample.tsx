/** @jsxImportSource cx */
import { enableTooltips, TextField, Button } from "cx/widgets";
import { bind } from "cx/ui";

enableTooltips();

export default () => (
  <cx>
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div tooltip="This is a basic tooltip." style="cursor: help;">
        Hover me for a basic tooltip
      </div>

      <div
        tooltip={{ placement: "right", text: "Tooltip on the right side!" }}
        style="cursor: help;"
      >
        Tooltip on right
      </div>

      <div
        tooltip={{
          placement: "up",
          title: "Tooltip Title",
          text: "This tooltip has a title.",
        }}
        style="cursor: help;"
      >
        Tooltip with title
      </div>

      <TextField
        value={bind("text")}
        required
        visited
        placeholder="Required field"
        tooltip="Validation errors are shown in tooltips"
      />

      <Button tooltip="Click me to do something">Button with tooltip</Button>
    </div>
  </cx>
);
