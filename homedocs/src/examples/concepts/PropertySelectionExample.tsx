import { createAccessorModelProxy } from "cx/data";
import { PropertySelection, Controller } from "cx/ui";
import { Grid, Checkbox } from "cx/widgets";

// @model
interface Item {
  id: number;
  name: string;
  selected: boolean;
}

interface PageModel {
  items: Item[];
  $record: Item;
}

const m = createAccessorModelProxy<PageModel>();
// @model-end

// @controller
class PageController extends Controller<PageModel> {
  onInit() {
    this.store.init(m.items, [
      { id: 1, name: "Apple", selected: false },
      { id: 2, name: "Banana", selected: true },
      { id: 3, name: "Cherry", selected: false },
      { id: 4, name: "Date", selected: false },
    ]);
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController} class="flex flex-col gap-4">
    <Grid
      records={m.items}
      selection={{
        type: PropertySelection,
        multiple: true,
      }}
      columns={[
        {
          items: <Checkbox value={m.$record.selected} />,
          align: "center",
          width: 30,
        },
        { header: "Name", field: "name" },
      ]}
    />
    <div class="p-3 bg-muted rounded text-sm">
      <strong>Store content</strong>
      <pre
        class="mt-2"
        text={(data: any) => JSON.stringify({ items: data.items }, null, 2)}
      />
    </div>
  </div>
);
// @index-end
