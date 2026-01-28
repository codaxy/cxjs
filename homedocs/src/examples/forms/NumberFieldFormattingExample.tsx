import { createModel } from "cx/data";
import { bind, LabelsTopLayout } from "cx/ui";
import { NumberField } from "cx/widgets";

// @model
interface Model {
  price: number;
  percent: number;
  quantity: number;
}

const m = createModel<Model>();
// @model-end

// @index
export default (
  <LabelsTopLayout columns={2}>
    <NumberField label="Currency (EUR)" value={bind(m.price, 1234.5)} format="currency;EUR" />
    <NumberField label="Currency (USD)" value={m.price} format="currency;USD" />
    <NumberField label="Percentage" value={bind(m.percent, 0.25)} format="p;0" scale={0.01} />
    <NumberField label="Two Decimals" value={bind(m.quantity, 42.5)} format="n;2" />
  </LabelsTopLayout>
);
// @index-end
