import { createModel } from "cx/data";
import { LabelsLeftLayout, UseParentLayout } from "cx/ui";
import { TextField, Checkbox, PureContainer } from "cx/widgets";

// @model
interface FormModel {
  text: string;
  text2: string;
  text3: string;
  showMore: boolean;
}

const m = createModel<FormModel>();
// @model-end

// @index
export default () => (
  <LabelsLeftLayout>
    <TextField value={m.text} label="Label 1" />
    <Checkbox value={m.showMore}>Show More</Checkbox>
    <PureContainer layout={UseParentLayout} visible={m.showMore}>
      <TextField value={m.text2} label="Label 2" />
      <TextField value={m.text3} label="Label 3" />
    </PureContainer>
  </LabelsLeftLayout>
);
// @index-end
