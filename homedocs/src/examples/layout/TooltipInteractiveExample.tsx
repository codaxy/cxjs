import { createAccessorModelProxy } from "cx/data";
import { enableTooltips, Checkbox } from "cx/widgets";

enableTooltips();

// @model
interface PageModel {
  showTooltip: boolean;
  tooltipVisible: boolean;
}

const m = createAccessorModelProxy<PageModel>();
// @model-end

// @index
export default () => (
  <div className="flex flex-col items-start gap-4">
    <div
      tooltip={{
        alwaysVisible: m.showTooltip,
        placement: "right",
        text: "Tooltips can be set to always visible.",
      }}
    >
      <Checkbox value={m.showTooltip}>Always visible</Checkbox>
    </div>

    <div
      tooltip={{
        visible: m.tooltipVisible,
        alwaysVisible: m.tooltipVisible,
        placement: "right",
        text: "This tooltip is visible only while the checkbox is checked.",
      }}
    >
      <Checkbox value={m.tooltipVisible}>Controlled visibility</Checkbox>
    </div>

    <div
      tooltip={{ text: "I follow your mouse!", trackMouse: true, offset: 20 }}
      className="cursor-help"
    >
      Mouse tracking
    </div>
  </div>
);
// @index-end