import { createModel } from "cx/data";
import { Calendar } from "cx/widgets";

// @model
interface Model {
  date: string;
}

const m = createModel<Model>();
// @model-end

// @index
export default (
  <Calendar
    value={m.date}
    minValue="2024-06-10"
    maxValue="2024-06-20"
    refDate="2024-06-08"
    dayData={{
      [new Date("2024-06-11").toDateString()]: {
        style: "color: red; font-weight: bold",
      },
      [new Date("2024-06-12").toDateString()]: {
        disabled: true,
      },
      [new Date("2024-06-13").toDateString()]: {
        style: "outline: 2px solid #3b82f6",
      },
    }}
  />
);
// @index-end
