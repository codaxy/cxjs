import { createModel } from "cx/data";
import { bind } from "cx/ui";
import { Calendar } from "cx/widgets";

// @model
interface Model {
  date: string;
}

const m = createModel<Model>();
// @model-end

// @index
export default <Calendar value={bind(m.date, "2024-06-15")} showTodayButton />;
// @index-end
