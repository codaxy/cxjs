import { createModel } from "cx/data";
import {
  createFunctionalComponent,
  LabelsLeftLayout,
  LabelsTopLayout,
} from "cx/ui";
import { TextField } from "cx/widgets";

interface PageModel {
  form: {
    firstName: string;
    lastName: string;
  };
}

const m = createModel<PageModel>();

// @components
interface MyFormProps {
  vertical?: boolean;
}

const MyForm = createFunctionalComponent(({ vertical }: MyFormProps) => {
  let layout = !vertical
    ? LabelsLeftLayout
    : { type: LabelsTopLayout, vertical: true };
  return (
    <div layout={layout}>
      <TextField value={m.form.firstName} label="First Name" />
      <TextField value={m.form.lastName} label="Last Name" />
    </div>
  );
});
// @components-end

// @index
export default (
  <div class="flex gap-8 items-center">
    <MyForm />
    <MyForm vertical />
  </div>
);
// @index-end
