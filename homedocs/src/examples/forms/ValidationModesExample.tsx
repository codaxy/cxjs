import { createModel } from "cx/data";
import { LabelsLeftLayout } from "cx/ui";
import { enableTooltips, TextField, ValidationGroup } from "cx/widgets";

enableTooltips();

// @model
interface Model {
  tooltip: string;
  help: string;
  helpBlock: string;
}

const m = createModel<Model>();
// @model-end

// @index
export default (
  <ValidationGroup>
    <LabelsLeftLayout>
      <TextField
        label="Tooltip (default)"
        value={m.tooltip}
        required
        minLength={5}
        visited
        validationMode="tooltip"
      />
      <TextField
        label="Help"
        value={m.help}
        required
        minLength={5}
        visited
        validationMode="help"
      />
      <TextField
        label="Help Block"
        value={m.helpBlock}
        required
        minLength={5}
        visited
        validationMode="help-block"
      />
    </LabelsLeftLayout>
  </ValidationGroup>
);
// @index-end
