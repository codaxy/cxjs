import { append, createModel } from "cx/data";
import { Controller } from "cx/ui";
import { Button, Grid, TextField } from "cx/widgets";

// @model
interface Item {
  id: number;
  name: string;
}

interface Model {
  items: Item[];
  newName: string;
  nextId: number;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.items, [
      { id: 1, name: "First" },
      { id: 2, name: "Second" },
    ]);
    this.store.set(m.nextId, 3);
  }

  addItem() {
    const name = this.store.get(m.newName);
    if (!name) return;

    const id = this.store.get(m.nextId);
    this.store.update(m.items, (items) => append(items, { id, name }));
    this.store.set(m.nextId, id + 1);
    this.store.set(m.newName, "");
  }

  addMultiple() {
    const id = this.store.get(m.nextId);
    this.store.update(m.items, (items) =>
      append(items, { id, name: "Item A" }, { id: id + 1, name: "Item B" }),
    );
    this.store.set(m.nextId, id + 2);
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
      columns={[
        { header: "ID", field: "id", align: "center" },
        { header: "Name", field: "name" },
      ]}
    />
    <div style="margin-top: 16px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap">
      <TextField value={m.newName} placeholder="Enter name..." />
      <Button onClick="addItem">Add Item</Button>
      <Button onClick="addMultiple">Add Multiple</Button>
      <Button onClick="reset">Reset</Button>
    </div>
  </div>
);
// @index-end
