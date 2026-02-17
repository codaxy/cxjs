import { createModel } from "cx/ui";
import { Button, LabelsTopLayout, MsgBox, TextField } from "cx/widgets";

interface PageModel {
  name: string;
}

const m = createModel<PageModel>();

export default (
  <LabelsTopLayout vertical>
    <TextField value={m.name} label="Name" />
    <Button
      text="Greet"
      onClick={(event, { store }) => {
        let name = store.get(m.name);
        if (!name) return;
        MsgBox.alert(`Hello, ${name}! Welcome to CxJS!`);
      }}
      class="mt-2"
    />
  </LabelsTopLayout>
);
