import { createModel } from "cx/data";
import { Button, Toast } from "cx/widgets";

// @model
interface PageModel {
  toast: {
    visible: boolean;
  };
}

const m = createModel<PageModel>();
// @model-end

// @index
export default (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
    <Button
      onClick={(e, { store }) => {
        Toast.create({
          message: "This is a toast at the top.",
          placement: "top",
          timeout: 3000,
        }).open(store, { initiatingEvent: e });
      }}
    >
      Top
    </Button>
    <Button
      onClick={(e, { store }) => {
        Toast.create({
          message: "This is a toast on the right.",
          placement: "right",
          timeout: 3000,
        }).open(
          store,
          { initiatingEvent: e }, //required for mixed theming
        );
      }}
    >
      Right
    </Button>
    <Button
      onClick={(e, { store }) => {
        Toast.create({
          message: "This is a toast at the bottom.",
          placement: "bottom",
          timeout: 3000,
        }).open(
          store,
          { initiatingEvent: e }, //required for mixed theming
        );
      }}
    >
      Bottom
    </Button>
    <Button
      onClick={(e, { store }) => {
        Toast.create({
          message: "This is a toast on the left.",
          placement: "left",
          timeout: 3000,
        }).open(
          store,
          { initiatingEvent: e }, //required for mixed theming
        );
      }}
    >
      Left
    </Button>
  </div>
);
// @index-end
