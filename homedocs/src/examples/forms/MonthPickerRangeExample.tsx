import { createAccessorModelProxy } from "cx/data";
import { bind } from "cx/ui";
import { MonthPicker } from "cx/widgets";

// @model
interface Model {
  from: string;
  to: string;
}

const m = createAccessorModelProxy<Model>();
// @model-end

// @index
export default () => (
  <MonthPicker range from={bind(m.from, "2024-03-01")} to={bind(m.to, "2024-06-01")} style="height: 25em" />
);
// @index-end
