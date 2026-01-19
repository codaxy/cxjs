import { createModel } from "cx/data";
import { TextField, Slider } from "cx/widgets";

// @model
interface PageModel {
  name: string;
  volume: number;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default () => (
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <TextField value={m.name} placeholder="Enter your name" />
      <div text={m.name} />
    </div>
    <div class="flex flex-col gap-2">
      <Slider value={m.volume} />
      <div text={m.volume} />
    </div>
    <div class="p-3 bg-muted rounded text-sm">
      <strong>Store content</strong>
      <pre class="mt-2" text={(data) => JSON.stringify(data, null, 2)} />
    </div>
  </div>
);
// @index-end
