import { createModel } from "cx/data";
import { DataProxy, LabelsTopLayout } from "cx/ui";
import { Slider } from "cx/widgets";

// @model
interface PageModel {
  level: number;
}

const m = createModel<PageModel>();

interface ProxyModel {
  $level: number;
}

const mProxy = createModel<ProxyModel>();
// @model-end

// @index
export default (
  <div>
    <div class="text-sm font-medium leading-none mb-2">Original</div>
    <Slider value={m.level} />

    <DataProxy value={m.level} alias={mProxy.$level}>
      <div class="text-sm font-medium leading-none mt-4 mb-2">Alias</div>
      <Slider value={mProxy.$level} />
    </DataProxy>
  </div>
);
// @index-end
