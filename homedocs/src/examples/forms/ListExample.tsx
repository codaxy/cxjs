import { createModel } from "cx/data";
import { Controller, KeySelection } from "cx/ui";
import { List } from "cx/widgets";

// @model
interface Item {
  id: number;
  text: string;
  description: string;
}

interface Model {
  records: Item[];
  selection: number;
  $record: Item;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller<typeof m> {
  onInit() {
    this.store.set(
      m.records,
      Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        text: `Item ${i + 1}`,
        description: `Description for item ${i + 1}`,
      }))
    );
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController}>
    <List
      records={m.records}
      selection={{ type: KeySelection, bind: m.selection, keyField: "id" }}
      mod="bordered"
      style="width: 300px"
      emptyText="No items found."
      recordAlias={m.$record}
    >
      <div class="font-medium" text={m.$record.text} />
      <div class="text-sm text-gray-500" text={m.$record.description} />
    </List>
  </div>
);
// @index-end
