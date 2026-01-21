import { createModel } from "cx/data";
import { Button, Toast, TextField } from "cx/widgets";

// @model
interface PageModel {
  simpleToast: {
    visible: boolean;
  };
  complexToast: {
    visible: boolean;
    reply: string;
  };
}

const m = createModel<PageModel>();
// @model-end

// @index
export default () => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
    <Button
      onClick={(e, { store }) => {
        store.toggle(m.simpleToast.visible);
      }}
    >
      Toggle Simple Toast
    </Button>
    <Button
      onClick={(e, { store }) => {
        store.toggle(m.complexToast.visible);
      }}
    >
      Toggle Complex Toast
    </Button>

    <Toast visible={m.simpleToast.visible}>
      This toast is controlled by store state.
      <Button icon="close" dismiss mod="hollow" style={{ marginLeft: "8px" }} />
    </Toast>

    <Toast visible={m.complexToast.visible}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <TextField value={m.complexToast.reply} placeholder="Quick reply..." />
        <Button icon="check" dismiss mod="primary" />
        <Button icon="close" dismiss />
      </div>
    </Toast>
  </div>
);
// @index-end
