import { createModel, Store } from "cx/data";
import { Button } from "cx/widgets";

// @model
interface PageModel {
  count: number;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default (
  <div class="flex flex-col gap-4">
    <div class="flex gap-2 items-center">
      <Button
        onClick={(e, { store }) => {
          store.set(m.count, (store.get(m.count) || 0) - 1);
        }}
      >
        -
      </Button>
      <span class="w-12 text-center" text={m.count} />
      <Button
        onClick={(e, { store }) => {
          store.set(m.count, (store.get(m.count) || 0) + 1);
        }}
      >
        +
      </Button>
    </div>
    <div class="p-3 bg-muted rounded text-sm">
      <strong>Store content</strong>
      <pre class="mt-2" text={(data) => JSON.stringify(data, null, 2)} />
    </div>
  </div>
);
// @index-end
