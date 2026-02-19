import { createModel } from "cx/data";
import { Button, MsgBox } from "cx/widgets";

// @model
interface PageModel {
  result: string;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      alignItems: "center",
    }}
  >
    <Button
      onClick={async (e, { store }) => {
        const result = await MsgBox.yesNo("Do you want to proceed?");
        store.set(m.result, result);
      }}
    >
      Simple Yes/No
    </Button>
    <Button
      onClick={async (e, { store }) => {
        const result = await MsgBox.yesNo({
          title: "Confirm Action",
          message: "Are you sure you want to delete this item?",
          yesText: "Delete",
          noText: "Cancel",
          yesButtonMod: "primary",
          noButtonMod: "secondary",
          initiatingEvent: e,
        });
        store.set(m.result, result);
      }}
    >
      Custom Buttons
    </Button>
    <span
      text={{ expr: `{${m.result}} ? "Last result: " + {${m.result}} : ""` }}
    />
  </div>
);
// @index-end
