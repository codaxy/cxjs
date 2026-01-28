import { createModel } from "cx/data";
import { Controller, expr } from "cx/ui";
import { Button, Checkbox, Repeater } from "cx/widgets";

// @model
interface Item {
  text: string;
  checked: boolean;
}

interface PageModel {
  items: Item[];
  $record: Item;
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.reset();
  }
  reset() {
    this.store.set(m.items, [
      { text: "Learn CxJS basics", checked: true },
      { text: "Build a sample app", checked: false },
      { text: "Master data binding", checked: false },
    ]);
  }
}
// @controller-end

// @index
export default (
  <div class="flex flex-col gap-4" controller={PageController}>
    <div class="flex flex-col gap-2">
      <Repeater records={m.items} recordAlias={m.$record}>
        <div class="flex items-center gap-2">
          <Checkbox value={m.$record.checked} text={m.$record.text} />
          <Button
            icon="close"
            mod="hollow"
            onClick={(e, { store }) => {
              store.delete(m.$record);
            }}
          />
        </div>
      </Repeater>
    </div>
    <div class="flex items-center gap-4">
      <div class="text-sm text-muted-foreground">
        Completed:{" "}
        <span
          text={expr(
            m.items,
            (items: Item[]) => items.filter((a) => a.checked).length,
          )}
        />{" "}
        of <span text={m.items.length} /> tasks
      </div>
      <Button
        onClick={(e, ins) => {
          ins.getControllerByType(PageController).reset();
        }}
      >
        Reset
      </Button>
    </div>
  </div>
);
// @index-end
