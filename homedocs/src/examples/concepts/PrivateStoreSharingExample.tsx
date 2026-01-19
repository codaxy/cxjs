import { createModel } from "cx/data";
import { LabelsTopLayout } from "cx/ui";
import { PrivateStore, Slider } from "cx/widgets";

// @model
interface PageModel {
  slider: number;
}

const m = createModel<PageModel>();

interface PrivateModel {
  globalValue: number;
  localValue: number;
}

const mPrivate = createModel<PrivateModel>();
// @model-end

// @index
export default () => (
  <div>
    <div class="text-sm font-medium leading-none mb-2">Global Store</div>
    <Slider value={m.slider} />

    <PrivateStore data={{ globalValue: m.slider }}>
      <div class="text-sm font-medium leading-none mt-4 mb-2">
        Private Store A
      </div>
      <LabelsTopLayout>
        <Slider value={mPrivate.globalValue} label="Shared" />
        <Slider value={mPrivate.localValue} label="Private" />
      </LabelsTopLayout>
    </PrivateStore>

    <PrivateStore data={{ globalValue: m.slider }}>
      <div class="text-sm font-medium leading-none mt-4 mb-2">
        Private Store B
      </div>
      <LabelsTopLayout>
        <Slider value={mPrivate.globalValue} label="Shared" />
        <Slider value={mPrivate.localValue} label="Private" />
      </LabelsTopLayout>
    </PrivateStore>
  </div>
);
// @index-end
