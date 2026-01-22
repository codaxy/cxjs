import { filter, createModel } from "cx/data";
import { Controller } from "cx/ui";
import { Button, Grid, NumberField } from "cx/widgets";

// @model
interface Item {
  id: number;
  name: string;
  value: number;
}

interface Model {
  items: Item[];
  threshold: number;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.items, [
      { id: 1, name: "Alpha", value: 10 },
      { id: 2, name: "Beta", value: 25 },
      { id: 3, name: "Gamma", value: 5 },
      { id: 4, name: "Delta", value: 30 },
      { id: 5, name: "Epsilon", value: 15 },
    ]);
    this.store.set(m.threshold, 15);
  }

  filterAboveThreshold() {
    const threshold = this.store.get(m.threshold);
    this.store.update(m.items, (items) =>
      filter(items, (item) => item.value >= threshold),
    );
  }

  filterEvenIds() {
    this.store.update(m.items, (items) =>
      filter(items, (item) => item.id % 2 === 0),
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
        { header: "Value", field: "value", align: "right" },
      ]}
    />
    <div style="margin-top: 16px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap">
      <span>Threshold:</span>
      <NumberField value={m.threshold} style="width: 60px" />
      <Button onClick="filterAboveThreshold">Keep ≥ Threshold</Button>
      <Button onClick="filterEvenIds">Keep Even IDs</Button>
      <Button onClick="reset">Reset</Button>
    </div>
  </div>
);
// @index-end
