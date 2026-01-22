import { moveElement, createModel } from "cx/data";
import { Controller, KeySelection } from "cx/ui";
import { Button, Grid } from "cx/widgets";

// @model
interface Item {
  id: number;
  name: string;
}

interface Model {
  items: Item[];
  selectedId: number;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.items, [
      { id: 1, name: "First" },
      { id: 2, name: "Second" },
      { id: 3, name: "Third" },
      { id: 4, name: "Fourth" },
      { id: 5, name: "Fifth" },
    ]);
    this.store.set(m.selectedId, 1);
  }

  getSelectedIndex() {
    const items = this.store.get(m.items);
    const selectedId = this.store.get(m.selectedId);
    return items.findIndex((item) => item.id === selectedId);
  }

  moveUp() {
    const index = this.getSelectedIndex();
    if (index > 0) {
      this.store.update(m.items, (items) => moveElement(items, index, index - 1));
    }
  }

  moveDown() {
    const index = this.getSelectedIndex();
    const items = this.store.get(m.items);
    if (index >= 0 && index < items.length - 1) {
      this.store.update(m.items, (items) => moveElement(items, index, index + 2));
    }
  }

  moveToTop() {
    const index = this.getSelectedIndex();
    if (index > 0) {
      this.store.update(m.items, (items) => moveElement(items, index, 0));
    }
  }

  moveToBottom() {
    const index = this.getSelectedIndex();
    const items = this.store.get(m.items);
    if (index >= 0 && index < items.length - 1) {
      this.store.update(m.items, (items) => moveElement(items, index, items.length));
    }
  }

  reset() {
    this.onInit();
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <Grid
      records={m.items}
      selection={{ type: KeySelection, bind: m.selectedId, keyField: "id" }}
      columns={[
        { header: "ID", field: "id", align: "center" },
        { header: "Name", field: "name" },
      ]}
    />
    <div style="margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap">
      <Button onClick="moveUp">Move Up</Button>
      <Button onClick="moveDown">Move Down</Button>
      <Button onClick="moveToTop">Move to Top</Button>
      <Button onClick="moveToBottom">Move to Bottom</Button>
      <Button onClick="reset">Reset</Button>
    </div>
  </div>
);
// @index-end
