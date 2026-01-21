import { diffArrays, createModel } from "cx/data";
import { Controller } from "cx/ui";
import { Button, Grid } from "cx/widgets";

// @model
interface Item {
  id: number;
  name: string;
}

interface DiffResult {
  added: Item[];
  changed: { before: Item; after: Item }[];
  unchanged: Item[];
  removed: Item[];
}

interface Model {
  oldItems: Item[];
  newItems: Item[];
  diff: DiffResult;
}

const m = createModel<Model>();

// Shared object instances - same reference = unchanged
const apple = { id: 1, name: "Apple" };
const banana = { id: 2, name: "Banana" };
const cherry = { id: 3, name: "Cherry" };
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    // Apple is unchanged (same reference)
    // Banana changed to Blueberry (different object, same id)
    // Cherry removed
    // Date added
    this.store.set(m.oldItems, [apple, banana, cherry]);
    this.store.set(m.newItems, [
      apple, // same reference = unchanged
      { id: 2, name: "Blueberry" }, // new object with same id = changed
      { id: 4, name: "Date" }, // new id = added
    ]);
    this.computeDiff();
  }

  computeDiff() {
    const oldItems = this.store.get(m.oldItems);
    const newItems = this.store.get(m.newItems);
    const diff = diffArrays(oldItems, newItems, (item) => item.id);
    this.store.set(m.diff, diff);
  }

  scenario1() {
    const a = { id: 1, name: "A" };
    this.store.set(m.oldItems, [a]);
    this.store.set(m.newItems, [a, { id: 2, name: "B" }, { id: 3, name: "C" }]);
    this.computeDiff();
  }

  scenario2() {
    const a = { id: 1, name: "A" };
    const b = { id: 2, name: "B" };
    const c = { id: 3, name: "C" };
    this.store.set(m.oldItems, [a, b, c]);
    this.store.set(m.newItems, [b]);
    this.computeDiff();
  }

  scenario3() {
    const oldA = { id: 1, name: "Old A" };
    const b = { id: 2, name: "B" };
    this.store.set(m.oldItems, [oldA, b]);
    this.store.set(m.newItems, [{ id: 1, name: "New A" }, { id: 3, name: "C" }]);
    this.computeDiff();
  }

  reset() {
    this.onInit();
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController}>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px">
      <div>
        <h4 style="margin: 0 0 8px">Old Array</h4>
        <Grid
          records={m.oldItems}
          columns={[
            { header: "ID", field: "id" },
            { header: "Name", field: "name" },
          ]}
        />
      </div>
      <div>
        <h4 style="margin: 0 0 8px">New Array</h4>
        <Grid
          records={m.newItems}
          columns={[
            { header: "ID", field: "id" },
            { header: "Name", field: "name" },
          ]}
        />
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px">
      <div>
        <h4 style="margin: 0 0 8px; color: green">Added</h4>
        <Grid
          records={m.diff.added}
          columns={[
            { header: "ID", field: "id" },
            { header: "Name", field: "name" },
          ]}
        />
      </div>
      <div>
        <h4 style="margin: 0 0 8px; color: orange">Changed</h4>
        <Grid
          records={m.diff.changed}
          columns={[
            { header: "Before", field: "before.name" },
            { header: "After", field: "after.name" },
          ]}
        />
      </div>
      <div>
        <h4 style="margin: 0 0 8px; color: gray">Unchanged</h4>
        <Grid
          records={m.diff.unchanged}
          columns={[
            { header: "ID", field: "id" },
            { header: "Name", field: "name" },
          ]}
        />
      </div>
      <div>
        <h4 style="margin: 0 0 8px; color: red">Removed</h4>
        <Grid
          records={m.diff.removed}
          columns={[
            { header: "ID", field: "id" },
            { header: "Name", field: "name" },
          ]}
        />
      </div>
    </div>

    <div style="display: flex; gap: 8px; flex-wrap: wrap">
      <Button onClick="scenario1">Add Items</Button>
      <Button onClick="scenario2">Remove Items</Button>
      <Button onClick="scenario3">Mixed Changes</Button>
      <Button onClick="reset">Reset</Button>
    </div>
  </div>
);
// @index-end
