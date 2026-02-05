import { createModel } from "cx/data";
import { LabelsTopLayout } from "cx/ui";
import { ColorField } from "cx/widgets";

// @model
interface Model {
  color: string;
  hsla: string;
  hex: string;
  placeholder: string;
}

const m = createModel<Model>();
// @model-end

// @index
export default (
  <LabelsTopLayout columns={2}>
    <ColorField label="Standard (RGBA)" value={m.color} autoFocus />
    <ColorField label="HSLA Format" value={m.hsla} format="hsla" />
    <ColorField label="Hex Format" value={m.hex} format="hex" />
    <ColorField label="Disabled" value={m.color} disabled />
    <ColorField label="Read-only" value={m.color} readOnly />
    <ColorField
      label="Placeholder"
      value={m.placeholder}
      placeholder="Pick a color..."
    />
  </LabelsTopLayout>
);
// @index-end
