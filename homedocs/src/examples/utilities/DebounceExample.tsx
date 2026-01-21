import { debounce } from "cx/util";
import { createModel } from "cx/data";
import { Controller } from "cx/ui";
import { TextField, Button } from "cx/widgets";

// @model
interface Model {
  input: string;
  debouncedValue: string;
  searchCount: number;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  debouncedSearch!: ReturnType<typeof debounce>;

  onInit() {
    this.store.set(m.input, "");
    this.store.set(m.debouncedValue, "");
    this.store.set(m.searchCount, 0);

    this.debouncedSearch = debounce((value: string) => {
      this.store.set(m.debouncedValue, value);
      this.store.update(m.searchCount, (c) => c + 1);
    }, 500);

    // Subscribe to input changes
    this.addTrigger("inputChange", [m.input], (value: string) => {
      this.debouncedSearch(value);
    });
  }

  searchNow() {
    const value = this.store.get(m.input);
    this.debouncedSearch.reset(value);
  }

  reset() {
    this.store.set(m.input, "");
    this.store.set(m.debouncedValue, "");
    this.store.set(m.searchCount, 0);
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController}>
    <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 16px">
      <TextField value={m.input} placeholder="Type to search..." style="width: 250px" />
      <Button onClick="searchNow">Search Now</Button>
      <Button onClick="reset">Reset</Button>
    </div>
    <div>
      <p>
        <strong>Input:</strong> <span text={m.input} />
      </p>
      <p>
        <strong>Debounced value:</strong> <span text={m.debouncedValue} /> (updates 500ms after typing stops)
      </p>
      <p>
        <strong>Search executions:</strong> <span text={m.searchCount} />
      </p>
    </div>
  </div>
);
// @index-end
