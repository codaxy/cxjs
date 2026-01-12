/** @jsxImportSource cx */
import { TextField } from "cx/widgets";
import { bind, LabelsLeftLayout } from "cx/ui";

export default () => (
  <cx>
    <div layout={LabelsLeftLayout}>
      <TextField
        label={{
          text: "Styled Label",
          style: "color: #0ea5e9; font-weight: bold",
        }}
        value={bind("text")}
      />
    </div>
  </cx>
);
