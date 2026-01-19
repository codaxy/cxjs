import { createModel } from "cx/data";
import { PrivateStore, Slider } from "cx/widgets";

// @model
interface PageModel {
  value: number;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default () => (
  <div>
    <div class="text-sm font-medium leading-none mb-2">Global Store</div>
    <Slider value={m.value} />
    <Slider value={m.value} />

    <PrivateStore>
      <div class="text-sm font-medium leading-none mt-4 mb-2">
        Private Store A
      </div>
      <Slider value={m.value} />
      <Slider value={m.value} />
    </PrivateStore>

    <PrivateStore>
      <div class="text-sm font-medium leading-none mt-4 mb-2">
        Private Store B
      </div>
      <Slider value={m.value} />
      <Slider value={m.value} />
    </PrivateStore>
  </div>
);
// @index-end
