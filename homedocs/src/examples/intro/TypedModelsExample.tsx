import { createAccessorModelProxy } from "cx/data";
import { TextField, Button } from "cx/widgets";

// @model
interface User {
  firstName: string;
  lastName: string;
}

interface PageModel {
  user: User;
  message: string;
}

const m = createAccessorModelProxy<PageModel>();
// @model-end

// @index
export default () => (
  <div class="flex flex-col gap-4">
    <div class="flex gap-2">
      <TextField value={m.user.firstName} placeholder="First name" />
      <TextField value={m.user.lastName} placeholder="Last name" />
    </div>
    <div class="p-3 bg-muted rounded text-sm">
      <strong>Store content</strong>
      <pre class="mt-2" text={(data) => JSON.stringify(data, null, 2)} />
    </div>
  </div>
);
// @index-end
