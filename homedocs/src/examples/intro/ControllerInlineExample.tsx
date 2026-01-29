import { createModel } from "cx/data";
import { NumberField } from "cx/widgets";
import { tpl } from "cx/ui";

// @model
interface PageModel {
  count: number;
  double: number;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default (
  <div
    controller={{
      onInit() {
        this.store.init(m.count, 0);
        this.addComputable(m.double, [m.count], (c) => c * 2);
      },
    }}
    class="flex items-center gap-4"
  >
    <NumberField value={m.count} style="width: 100px" />
    <span text={tpl(m.double, "Double: {0}")} />
  </div>
);
// @index-end
