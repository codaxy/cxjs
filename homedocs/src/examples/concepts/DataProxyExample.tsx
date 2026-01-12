import { createAccessorModelProxy } from "cx/data";
import { DataProxy, LabelsTopLayout } from "cx/ui";
import { Slider } from "cx/widgets";

// @model
interface PageModel {
  level: number;
}

const m = createAccessorModelProxy<PageModel>();

interface ProxyModel {
  $level: number;
}

const mProxy = createAccessorModelProxy<ProxyModel>();
// @model-end

// @index
export default () => (
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
