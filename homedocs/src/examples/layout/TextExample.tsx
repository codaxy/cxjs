import { createModel } from "cx/data";
import { Text, TextField } from "cx/widgets";
import { LabelsLeftLayout } from "cx/ui";

// @model
interface PageModel {
  name: string;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default () => (
  <LabelsLeftLayout>
    <TextField value={m.name} label="Name:" placeholder="Enter your name" />
    <Text value={m.name} />
  </LabelsLeftLayout>
);
// @index-end
