import { createModel } from "cx/data";
import { Button } from "cx/widgets";

// @model
interface PageModel {
  user: {
    name: string;
    age: number;
  };
}

const m = createModel<PageModel>();
// @model-end

// @index
export default (
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap gap-2">
      <Button
        onClick={(e, { store }) => {
          store.set(m.user.name, "John");
        }}
      >
        set(m.user.name, "John")
      </Button>
      <Button
        onClick={(e, { store }) => {
          store.update(m.user.age, (age) => (age || 0) + 1);
        }}
      >
        update(m.user.age, age =&gt; age + 1)
      </Button>
      <Button
        onClick={(e, { store }) => {
          store.delete(m.user.name);
        }}
      >
        delete(m.user.name)
      </Button>
      <Button
        onClick={(e, { store }) => {
          store.set(m.user, { name: "Jane", age: 25 });
        }}
      >
        set(m.user, &#123;...&#125;)
      </Button>
    </div>
    <div class="p-3 bg-muted rounded text-sm">
      <strong>Store content</strong>
      <pre class="mt-2" text={(data) => JSON.stringify(data, null, 2)} />
    </div>
  </div>
);
// @index-end
