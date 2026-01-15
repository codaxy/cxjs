import { createModel } from "cx/data";
import { Button, Switch, TextField } from "cx/widgets";

// @model
interface PageModel {
  name: string;
  showMessage: boolean;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default () => (
  <div class="flex flex-col gap-4">
    <div class="p-4 border border-border rounded">
      <strong>Mixing Widgets and HTML</strong>
      <div class="flex gap-2 items-center mt-2">
        <TextField value={m.name} placeholder="Your name" />
        <Button>Greet</Button>
      </div>
    </div>

    <div class="p-4 border border-border rounded min-h-24">
      <strong>Visibility Control</strong>
      <div class="mt-2">
        <Switch value={m.showMessage}>Show message</Switch>
      </div>
      <div visible={m.showMessage} class="mt-2 text-primary">
        This text is conditionally visible!
      </div>
    </div>
  </div>
);
// @index-end
