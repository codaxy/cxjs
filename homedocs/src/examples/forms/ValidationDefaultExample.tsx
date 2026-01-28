import { createModel } from "cx/data";
import { LabelsLeftLayout } from "cx/ui";
import { enableTooltips, TextField } from "cx/widgets";

enableTooltips();

// @model
interface Model {
  name: string;
}

const m = createModel<Model>();
// @model-end

// @index
export default (
  <LabelsLeftLayout>
    <TextField label="Name" value={m.name} placeholder="Required" required />
  </LabelsLeftLayout>
);
// @index-end
