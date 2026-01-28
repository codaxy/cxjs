import { createModel } from "cx/data";
import { Checkbox, Overlay } from "cx/widgets";

// @model
interface PageModel {
  showOverlay: boolean;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default (
  <div>
    <Checkbox value={m.showOverlay}>Show Overlay</Checkbox>
    <Overlay
      visible={m.showOverlay}
      style={{ background: "yellow", padding: "30px" }}
      draggable
    >
      This is a draggable overlay.
    </Overlay>
  </div>
);
// @index-end
