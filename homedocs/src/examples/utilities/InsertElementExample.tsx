import { insertElement, createModel } from "cx/data";
import { Controller } from "cx/ui";
import { Button, Grid, NumberField, TextField } from "cx/widgets";

// @model
interface Item {
  id: number;
  name: string;
}

interface Model {
  items: Item[];
  insertIndex: number;
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
      { id: 3, name: "Third" },
    ]);
    this.store.set(m.insertIndex, 1);
    this.store.set(m.newName, "New Item");
    this.store.set(m.nextId, 4);
  }

  insertItem() {
    const index = this.store.get(m.insertIndex);
    const name = this.store.get(m.newName);
    const id = this.store.get(m.nextId);

    this.store.update(m.items, (items) =>
      insertElement(items, index, { id, name }),
    );
    this.store.set(m.nextId, id + 1);
  }

  insertMultiple() {
    const index = this.store.get(m.insertIndex);
    const id = this.store.get(m.nextId);

    this.store.update(m.items, (items) =>
      insertElement(
        items,
        index,
        { id, name: "Item A" },
        { id: id + 1, name: "Item B" },
      ),
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
        { header: "#", field: "$index", align: "center" },
        { header: "ID", field: "id", align: "center" },
        { header: "Name", field: "name" },
      ]}
    />
    <div style="margin-top: 16px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap">
      <span>Index:</span>
      <NumberField value={m.insertIndex} style="width: 50px" />
      <TextField value={m.newName} style="width: 100px" />
      <Button onClick="insertItem">Insert</Button>
      <Button onClick="insertMultiple">Insert Multiple</Button>
      <Button onClick="reset">Reset</Button>
    </div>
  </div>
);
// @index-end
