import { createModel } from "cx/data";
import { bind, expr, LabelsTopLayout } from "cx/ui";
import { Switch } from "cx/widgets";

// @model
interface Model {
  enabled: boolean;
}

const m = createModel<Model>();
// @model-end

// @index
export default (
  <LabelsTopLayout vertical>
    <Switch
      label="Standard"
      on={bind(m.enabled, true)}
      text={expr(m.enabled, (v) => (v ? "ON" : "OFF"))}
    />
    <Switch label="Disabled" on={m.enabled} disabled />
    <Switch label="Read-only" on={m.enabled} readOnly />
    <Switch
      label="Styled"
      on={m.enabled}
      handleStyle="background: white"
      rangeStyle="background: lightsteelblue"
    >
      <span class="text-red-500">Custom text</span>
    </Switch>
  </LabelsTopLayout>
);
// @index-end
