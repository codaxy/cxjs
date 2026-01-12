import { TextField, Button } from "cx/widgets";
import { createAccessorModelProxy } from "cx/ui";

// @model
interface PageModel {
  name: string;
}

const m = createAccessorModelProxy<PageModel>();
// @model-end

// @index
export default () => (
  <div class="flex gap-4 p-4">
    <TextField value={m.name} placeholder="Your name" class="flex-1" />
    <Button text="Submit" />
  </div>
);
// @index-end
