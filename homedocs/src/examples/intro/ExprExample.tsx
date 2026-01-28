import { createModel } from "cx/data";
import { TextField, NumberField } from "cx/widgets";
import { expr } from "cx/ui";

// @model
interface PageModel {
  firstName: string;
  lastName: string;
  price: number;
  quantity: number;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default (
  <div class="flex flex-col gap-4">
    <div class="grid grid-cols-2 gap-2">
      <TextField value={m.firstName} placeholder="First name" />
      <TextField value={m.lastName} placeholder="Last name" />
    </div>
    <div>
      <strong>Full name: </strong>
      <span
        text={expr(m.firstName, m.lastName, (first, last) =>
          `${first || ""} ${last || ""}`.trim(),
        )}
      />
    </div>

    <div class="grid grid-cols-2 gap-2">
      <NumberField value={m.price} placeholder="Price" format="currency;USD" />
      <NumberField value={m.quantity} placeholder="Quantity" />
    </div>
    <div>
      <strong>Total: </strong>
      <span
        text={expr(m.price, m.quantity, (price, qty) => {
          let total = (price || 0) * (qty || 0);
          return `$${total.toFixed(2)}`;
        })}
      />
    </div>
  </div>
);
// @index-end
