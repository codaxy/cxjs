import { createAccessorModelProxy } from "cx/data";
import { computable, DataProxy, LabelsTopLayout } from "cx/ui";
import { Slider } from "cx/widgets";

// @model
interface PageModel {
  level: number;
}

const m = createAccessorModelProxy<PageModel>();

interface ProxyModel {
  $inverted: number;
  $readOnly: number;
}

const mProxy = createAccessorModelProxy<ProxyModel>();
// @model-end

// @index
export default () => (
  <div>
    <LabelsTopLayout>
      <Slider value={m.level} label="Original" />
    </LabelsTopLayout>

    <DataProxy
      data={{
        $inverted: {
          expr: computable(m.level, (v) => 100 - v),
          set: (value, { store }) => {
            store.set(m.level, 100 - value);
          },
        },
        $readOnly: {
          expr: computable(m.level, (v) => v),
        },
      }}
    >
      <LabelsTopLayout>
        <Slider value={mProxy.$inverted} label="Inverted" />
        <Slider value={mProxy.$readOnly} label="Read-only" />
      </LabelsTopLayout>
    </DataProxy>
  </div>
);
// @index-end
