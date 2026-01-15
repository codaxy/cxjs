import { createAccessorModelProxy } from "cx/data";
import { enableTooltips, TextField, Checkbox } from "cx/widgets";

enableTooltips();

// @model
interface PageModel {
  text: string;
  showTooltip: boolean;
}

const m = createAccessorModelProxy<PageModel>();
// @model-end

// @index
export default () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
    <div tooltip="This is a basic tooltip." style={{ cursor: "help" }}>
      Basic tooltip
    </div>

    <div
      tooltip={{ placement: "right", text: "Tooltip on the right side!" }}
      style={{ cursor: "help" }}
    >
      Placement: right
    </div>

    <div
      tooltip={{
        placement: "up",
        title: "Tooltip Title",
        text: "This tooltip has a title.",
      }}
      style={{ cursor: "help" }}
    >
      With title
    </div>

    <TextField
      value={m.text}
      required
      visited
      placeholder="Required field"
      tooltip="Validation errors are shown in tooltips"
    />

    <TextField
      value={m.text}
      required
      visited
      placeholder="Error tooltip always visible"
      errorTooltip={{ placement: "right", alwaysVisible: true }}
    />

    <div
      tooltip={{
        alwaysVisible: m.showTooltip,
        placement: "right",
        text: "This tooltip can be always visible.",
      }}
    >
      <Checkbox value={m.showTooltip}>Always visible</Checkbox>
    </div>

    <div
      tooltip={{ text: "I follow your mouse!", trackMouse: true, offset: 20 }}
      style={{ cursor: "help" }}
    >
      Mouse tracking
    </div>

    <div
      style={{ cursor: "help" }}
      tooltip={{
        mouseTrap: true,
        text: "This tooltip stays visible while mouse is inside it. Useful for tooltips with links or interactive content.",
      }}
    >
      Mouse trap (hover and move into tooltip)
    </div>
  </div>
);
// @index-end
