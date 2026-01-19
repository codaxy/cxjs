import { createModel } from "cx/data";
import { bind, expr, LabelsTopLayout } from "cx/ui";
import { TextField } from "cx/widgets";
import "../../icons/lucide";

// @model
interface Model {
  text: string;
  search: string;
  password: string;
  showPassword: boolean;
}

const m = createModel<Model>();
// @model-end

// @index
export default () => (
  <LabelsTopLayout columns={2}>
    <TextField
      label="With Icon"
      value={m.search}
      icon="search"
      placeholder="Search..."
      showClear
    />
    <TextField
      label="Password Toggle"
      value={bind(m.password, "secret123")}
      inputType={expr(m.showPassword, (show) => (show ? "text" : "password"))}
      icon={{
        name: expr(m.showPassword, (show) => (show ? "eye-off" : "eye")),
        style: "pointer-events: all; cursor: pointer",
        onClick: (e, { store }) => {
          e.stopPropagation();
          store.toggle(m.showPassword);
        },
      }}
    />
    <TextField
      label="Custom Input Style"
      value={bind(m.text, "Styled input")}
      inputStyle={{ border: "2px solid #3b82f6", borderRadius: "8px" }}
    />
    <TextField label="View Mode" value={m.text} viewMode emptyText="N/A" />
  </LabelsTopLayout>
);
// @index-end
