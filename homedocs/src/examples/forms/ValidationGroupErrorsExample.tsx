import { createModel } from "cx/data";
import { falsy, LabelsTopLayout, truthy } from "cx/ui";
import {
  enableTooltips,
  ValidationGroup,
  NumberField,
  Validator,
  Repeater,
  type ValidationErrorData,
} from "cx/widgets";

enableTooltips();

// @model
interface Model {
  x: number;
  y: number;
  valid: boolean;
  errors: ValidationErrorData[];
  $error: ValidationErrorData;
}

const m = createModel<Model>();
// @model-end

// @index
export default (
  <div>
    <div class="mb-3">Enter X and Y so that X + Y = 20.</div>
    <div
      class="flex gap-16 pl-4 border-2 rounded p-4 items-center"
      className={{
        "border-red-600": falsy(m.valid),
        "border-green-500": truthy(m.valid),
      }}
    >
      <ValidationGroup valid={m.valid} errors={m.errors} visited>
        <LabelsTopLayout class="-mt-4">
          <NumberField
            label="X"
            value={m.x}
            required
            requiredText="Please enter X."
            style="width: 80px"
          />
          <NumberField
            label="Y"
            value={m.y}
            required
            requiredText="Please enter Y."
            style="width: 80px"
          />
        </LabelsTopLayout>
        <Validator
          value={{ x: m.x, y: m.y }}
          onValidate={({ x, y }) => {
            if (x + y !== 20) return "X + Y must equal 20";
          }}
          visited
        />
      </ValidationGroup>
      <ul class="text-red-700 text-sm" visible={falsy(m.valid)}>
        <Repeater records={m.errors} recordAlias={m.$error}>
          <li text={m.$error.message} class="list-disc!" />
        </Repeater>
      </ul>
      <div class="text-green-600 text-sm" visible={truthy(m.valid)}>
        Form is valid!
      </div>
    </div>
  </div>
);
// @index-end
