import { DateField, TextField } from "cx/widgets";
import {
  createModel,
  expr,
  hasValue,
  LabelsTopLayout,
} from "cx/ui";
import { dateDiff } from "cx/util";

// @model
interface PageModel {
  name: string;
  dob: string;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default () => (
  <div class="px-6 pb-6">
    <h3 text={expr(m.name, (name) => `Hello ${name ?? "World"}`)} />
    <LabelsTopLayout vertical>
      <TextField value={m.name} label="Enter your name:" />
      <DateField value={m.dob} label="What is your date of birth?" />
      <div
        visible={hasValue(m.dob)}
        text={expr(m.dob, (dob) => {
          if (!dob) return "-";
          let diff = dateDiff(new Date(), new Date(dob));
          let years = diff / (365.25 * 24 * 60 * 60 * 1000);
          return `You're approximately ${years.toFixed(1)} years old...`;
        })}
      />
    </LabelsTopLayout>
  </div>
);
// @index-end
