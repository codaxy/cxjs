import { createModel } from "cx/data";
import { Controller } from "cx/ui";
import { Button } from "cx/widgets";

// @model
interface PageModel {
  count: number;
}

const m = createModel<PageModel>();
// @model-end

// @controller
class CounterController extends Controller {
  onInit() {
    this.store.init(m.count, 0);
  }

  increment(amount: number = 1) {
    this.store.update(m.count, (count) => count + amount);
  }

  decrement(amount: number = 1) {
    this.store.update(m.count, (count) => count - amount);
  }

  reset() {
    this.store.set(m.count, 0);
  }
}
// @controller-end

// @index
export default () => (
  <div controller={CounterController} class="flex flex-col gap-4">
    <div class="flex gap-2 items-center">
      <Button
        onClick={(e, ins) => {
          ins.getControllerByType(CounterController).decrement();
        }}
      >
        -1
      </Button>
      <span class="w-12 text-center text-xl" text={m.count} />
      <Button
        onClick={(e, ins) => {
          ins.getControllerByType(CounterController).increment();
        }}
      >
        +1
      </Button>
      <Button
        onClick={(e, ins) => {
          ins.getControllerByType(CounterController).increment(10);
        }}
      >
        +10
      </Button>
      <Button
        onClick={(e, ins) => {
          ins.getControllerByType(CounterController).reset();
        }}
      >
        Reset
      </Button>
    </div>
  </div>
);
// @index-end
