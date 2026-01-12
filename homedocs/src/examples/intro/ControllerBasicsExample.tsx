import { createAccessorModelProxy } from "cx/data";
import { Controller } from "cx/ui";
import { Button, TextField } from "cx/widgets";

// @model
interface PageModel {
  name: string;
  greeting: string;
}

const m = createAccessorModelProxy<PageModel>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.init(m.name, "World");
  }

  greet() {
    let name = this.store.get(m.name);
    this.store.set(m.greeting, `Hello, ${name}!`);
  }

  clear() {
    this.store.delete(m.greeting);
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController} class="flex flex-col gap-4">
    <div class="flex gap-2">
      <TextField value={m.name} />
      <Button
        onClick={(e, { controller }) => {
          controller.greet();
        }}
      >
        Greet
      </Button>
      <Button
        onClick={(e, { controller }) => {
          controller.clear();
        }}
      >
        Clear
      </Button>
    </div>
    <div text={m.greeting} class="text-primary" />
    <div class="p-3 bg-muted rounded text-sm">
      <strong>Store content</strong>
      <pre class="mt-2" text={(data) => JSON.stringify(data, null, 2)} />
    </div>
  </div>
);
// @index-end
