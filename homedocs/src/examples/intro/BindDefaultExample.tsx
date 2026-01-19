import { createModel } from "cx/data";
import { bind } from "cx/ui";
import { TextField, NumberField } from "cx/widgets";

// @model
interface PageModel {
  username: string;
  count: number;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default () => (
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <TextField value={bind(m.username, "Guest")} placeholder="Username" />
      <div>
        <strong>Username: </strong>
        <span text={bind(m.username, "Guest")} />
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <NumberField value={bind(m.count, 0)} placeholder="Count" />
      <div>
        <strong>Count: </strong>
        <span text={bind(m.count, 0)} />
      </div>
    </div>
    <div class="p-3 bg-muted rounded text-sm">
      <strong>Store content</strong>
      <pre class="mt-2" text={(data) => JSON.stringify(data, null, 2)} />
    </div>
  </div>
);
// @index-end
