import { createAccessorModelProxy } from "cx/data";
import { SimpleSelection, Controller } from "cx/ui";
import { List } from "cx/widgets";

// @model
interface Item {
  id: number;
  name: string;
}

interface PageModel {
  items: Item[];
  selection: Item;
  $record: Item;
}

const m = createAccessorModelProxy<PageModel>();
// @model-end

// @controller
class PageController extends Controller<PageModel> {
  onInit() {
    this.store.init(m.items, [
      { id: 1, name: "Apple" },
      { id: 2, name: "Banana" },
      { id: 3, name: "Cherry" },
      { id: 4, name: "Date" },
    ]);
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController} class="flex flex-col gap-4">
    <List
      records={m.items}
      selection={{
        type: SimpleSelection,
        bind: m.selection,
      }}
    >
      <div text={m.$record.name} />
    </List>
    <div class="p-3 bg-muted rounded text-sm">
      <strong>Store content</strong>
      <pre
        class="mt-2"
        text={(data) => JSON.stringify({ selection: data.selection }, null, 2)}
      />
    </div>
  </div>
);
// @index-end
