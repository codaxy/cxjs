import { enableTooltips } from "cx/widgets";

enableTooltips();

// @index
export default () => (
  <div className="flex flex-col items-start gap-4">
    <div tooltip="This is a basic tooltip." className="cursor-help">
      Basic tooltip
    </div>

    <div
      tooltip={{ placement: "up", text: "This tooltip is displayed on top." }}
      className="cursor-help"
    >
      Placement: up
    </div>

    <div
      tooltip={{ placement: "right", text: "Tooltip on the right side!" }}
      className="cursor-help"
    >
      Placement: right
    </div>

    <div
      tooltip={{
        placement: "up",
        title: "Tooltip Title",
        text: "This tooltip has a title.",
      }}
      className="cursor-help"
    >
      With title
    </div>
  </div>
);
// @index-end
