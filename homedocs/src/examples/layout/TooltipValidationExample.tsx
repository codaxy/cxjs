import { createModel } from "cx/data";
import { enableTooltips, TextField } from "cx/widgets";

enableTooltips();

// @model
interface PageModel {
  text: string;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default () => (
  <div className="flex flex-col items-start gap-4">
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
      errorTooltip={{
        placement: "right",
        alwaysVisible: true,
        title: "Validation Error",
        mod: "error",
      }}
    />
  </div>
);
// @index-end
