import { createModel } from "cx/data";
import { bind } from "cx/ui";
import { MonthPicker } from "cx/widgets";

// @model
interface Model {
  month: string;
}

const m = createModel<Model>();
// @model-end

// @index
export default () => <MonthPicker value={bind(m.month, "2024-06-01")} style="height: 25em" />;
// @index-end
