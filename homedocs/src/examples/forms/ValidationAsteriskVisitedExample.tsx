import { createModel } from "cx/data";
import { LabelsLeftLayout } from "cx/ui";
import { enableTooltips, TextField } from "cx/widgets";

enableTooltips();

// @model
interface Model {
  asterisk: string;
  visited: string;
}

const m = createModel<Model>();
// @model-end

// @index
export default () => (
  <LabelsLeftLayout>
    <TextField label="Asterisk" value={m.asterisk} placeholder="Required" required asterisk />
    <TextField label="Visited" value={m.visited} placeholder="Required" required visited />
  </LabelsLeftLayout>
);
// @index-end
