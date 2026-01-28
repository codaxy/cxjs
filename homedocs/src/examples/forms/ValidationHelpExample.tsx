import { createModel } from "cx/data";
import { LabelsLeftLayout } from "cx/ui";
import {
  TextField,
  ValidationGroup,
  ValidationError,
  Button,
} from "cx/widgets";
import "../../icons/lucide";

// @model
interface Model {
  help: string;
  helpButton: string;
  helpError: string;
}

const m = createModel<Model>();
// @model-end

// @index
export default (
  <ValidationGroup>
    <LabelsLeftLayout>
      <TextField
        label="Help Text"
        value={m.help}
        help={<span class="text-sm text-gray-500">Additional info</span>}
      />
      <TextField
        label="Help Button"
        value={m.helpButton}
        help={<Button icon="calculator" mod="hollow" />}
      />
      <TextField
        label="Help Error"
        value={m.helpError}
        required
        visited
        help={ValidationError}
      />
    </LabelsLeftLayout>
  </ValidationGroup>
);
// @index-end
