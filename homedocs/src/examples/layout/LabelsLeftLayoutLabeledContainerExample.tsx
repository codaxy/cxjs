import { LabelsLeftLayout } from "cx/ui";
import { bind } from "cx/ui";
import { TextField, Checkbox, LabeledContainer } from "cx/widgets";

export default () => (
  <LabelsLeftLayout>
    <TextField value={bind("text")} label="Label 1" />
    <Checkbox value={bind("check")} label="Label 2">
      Checkbox
    </Checkbox>
    <LabeledContainer label="Label 3">
      <TextField value={bind("text2")} />
      <TextField value={bind("text3")} />
    </LabeledContainer>
  </LabelsLeftLayout>
);
