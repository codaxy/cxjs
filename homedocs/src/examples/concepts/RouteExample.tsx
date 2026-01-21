import { createModel } from "cx/data";
import { Controller } from "cx/ui";
import { Route, Button } from "cx/widgets";

// @model
interface PageModel {
  url: string;
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller<PageModel> {
  onInit() {
    this.store.init(m.url, "~/home");
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController} class="flex flex-col gap-4">
    <nav class="flex gap-2">
      <Button onClick={(e, { store }) => store.set(m.url, "~/home")}>
        Home
      </Button>
      <Button onClick={(e, { store }) => store.set(m.url, "~/about")}>
        About
      </Button>
      <Button onClick={(e, { store }) => store.set(m.url, "~/contact")}>
        Contact
      </Button>
    </nav>
    <div class="p-4 bg-muted rounded">
      <Route route="~/home" url={m.url}>
        <h2 class="font-semibold">Home</h2>
        <p class="text-sm text-muted-foreground">Welcome to the home page.</p>
      </Route>
      <Route route="~/about" url={m.url}>
        <h2 class="font-semibold">About</h2>
        <p class="text-sm text-muted-foreground">Learn more about us.</p>
      </Route>
      <Route route="~/contact" url={m.url}>
        <h2 class="font-semibold">Contact</h2>
        <p class="text-sm text-muted-foreground">Get in touch with us.</p>
      </Route>
    </div>
    <div class="text-xs text-muted-foreground">
      Current URL: <code text={m.url} />
    </div>
  </div>
);
// @index-end
