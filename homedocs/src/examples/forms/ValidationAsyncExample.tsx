import { createModel } from "cx/data";
import { FirstVisibleChildLayout, LabelsTopLayout } from "cx/ui";
import { TextField, ValidationGroup, ValidationError, Icon } from "cx/widgets";
import "../../icons/lucide";

// @model
interface Model {
  username: string;
}

const m = createModel<Model>();
// @model-end

// @index
export default (
  <ValidationGroup>
    <LabelsTopLayout vertical>
      <TextField
        label="Username"
        value={m.username}
        required
        visited
        onValidate={(v) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(v == "cx" ? "This name is taken." : false);
            }, 500);
          })
        }
        help={
          <FirstVisibleChildLayout>
            <ValidationError />
            <Icon name="check" class="text-green-600" />
          </FirstVisibleChildLayout>
        }
      />
    </LabelsTopLayout>
  </ValidationGroup>
);
// @index-end
