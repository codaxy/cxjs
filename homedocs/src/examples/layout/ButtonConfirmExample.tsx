import { Button, MsgBox } from "cx/widgets";

// @index
export default () => (
  <div className="flex flex-wrap gap-2 items-center">
    <Button
      mod="danger"
      confirm="Are you sure you want to delete this item?"
      onClick={() => MsgBox.alert("Item deleted!")}
    >
      Delete
    </Button>
  </div>
);
// @index-end
