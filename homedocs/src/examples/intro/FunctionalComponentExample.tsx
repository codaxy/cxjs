import { createModel } from "cx/data";
import type { AccessorChain } from "cx/ui";
import { bind, createFunctionalComponent } from "cx/ui";
import { Button } from "cx/widgets";

interface PageModel {
  count1: number;
  count2: number;
}

const m = createModel<PageModel>();

// @components
interface CounterProps {
  value: AccessorChain<number>;
  label: string;
}

const Counter = createFunctionalComponent(({ value, label }: CounterProps) => (
  <div class="flex items-center gap-3 p-3 border rounded">
    <span class="font-medium">{label}:</span>
    <span class="text-lg font-bold" text={bind(value, 0)} />
    <Button
      onClick={(e, { store }) => store.update(value, (v) => (v || 0) + 1)}
    >
      +
    </Button>
    <Button
      onClick={(e, { store }) => store.update(value, (v) => (v || 0) - 1)}
    >
      -
    </Button>
  </div>
));
// @components-end

// @index
export default () => (
  <div class="flex flex-col gap-4">
    <Counter value={m.count1} label="Counter A" />
    <Counter value={m.count2} label="Counter B" />
  </div>
);
// @index-end
