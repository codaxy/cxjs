import { createModel } from "cx/data";
import { Button, TextField } from "cx/widgets";

// @model
interface PageModel {
  name: string;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default (
  <cx>
    <div class="flex gap-2 p-4">
      <TextField value={m.name} placeholder="Your name" />
      <Button>Submit</Button>
    </div>
  </cx>
);
// @index-end
