import { updateArray, createModel } from "cx/data";
import { Controller } from "cx/ui";
import { Button, Grid } from "cx/widgets";

// @model
interface Item {
  id: number;
  name: string;
  count: number;
}

interface Model {
  items: Item[];
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.items, [
      { id: 1, name: "Apple", count: 5 },
      { id: 2, name: "Banana", count: 3 },
      { id: 3, name: "Cherry", count: 8 },
      { id: 4, name: "Date", count: 2 },
    ]);
  }

  incrementAll() {
    this.store.update(m.items, (items) =>
      updateArray(items, (item) => ({ ...item, count: item.count + 1 })),
    );
  }

  incrementEven() {
    this.store.update(m.items, (items) =>
      updateArray(
        items,
        (item) => ({ ...item, count: item.count + 1 }),
        (item) => item.id % 2 === 0,
      ),
    );
  }

  removeSmall() {
    this.store.update(m.items, (items) =>
      updateArray(
        items,
        (item) => item,
        null,
        (item) => item.count < 3,
      ),
    );
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
        { header: "Count", field: "count", align: "right" },
      ]}
    />
    <div style="margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap">
      <Button onClick="incrementAll">Increment All</Button>
      <Button onClick="incrementEven">Increment Even IDs</Button>
      <Button onClick="removeSmall">Remove Count &lt; 3</Button>
      <Button onClick="reset">Reset</Button>
    </div>
  </div>
);
// @index-end
