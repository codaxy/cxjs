import { createModel } from "cx/data";
import { LabelsLeftLayout, LabelsTopLayout, expr } from "cx/ui";
import { Checkbox, TextField } from "cx/widgets";

// @model
interface PageModel {
  enabled: boolean;
  value: string;
  name: string;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default (
  <LabelsTopLayout>
    <TextField
      value={m.name}
      label={{
        text: "Styled Label",
        style: "color: blue; font-weight: bold",
      }}
    />
    <TextField
      value={m.value}
      label={
        <Checkbox value={m.enabled} disabled={false}>
          Unique Name
        </Checkbox>
      }
      disabled={expr(m.enabled, (enabled) => !enabled)}
    />
  </LabelsTopLayout>
);
// @index-end
