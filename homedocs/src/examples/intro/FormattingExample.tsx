import { createAccessorModelProxy } from "cx/data";
import { Format } from "cx/util";
import { bind, expr, format, LabelsTopLayout } from "cx/ui";
import { NumberField, DateField } from "cx/widgets";

// @model
interface PageModel {
  price: number;
  quantity: number;
  date: Date;
}

const m = createAccessorModelProxy<PageModel>();
// @model-end

// @index
export default () => (
  <div class="flex flex-col gap-4">
    <LabelsTopLayout columns={2}>
      <NumberField
        value={bind(m.price, 100)}
        label="Price"
        format="currency;USD;2"
      />
      <NumberField value={bind(m.quantity, 5)} label="Quantity" format="n;0" />
      <DateField
        value={bind(m.date, new Date())}
        label="Date"
        format="d;yyyyMMdd"
      />
    </LabelsTopLayout>
    <table class="w-full text-sm mt-4">
      <thead>
        <tr>
          <th class="text-left py-2 pr-4 border-b border-border">Format</th>
          <th class="text-left py-2 border-b border-border">Result</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="py-2 pr-4">
            <code>currency;USD;2</code>
          </td>
          <td class="py-2" text={format(m.price, "currency;USD;2")} />
        </tr>
        <tr>
          <td class="py-2 pr-4">
            <code>n;0</code>
          </td>
          <td class="py-2" text={format(m.quantity, "n;0")} />
        </tr>
        <tr>
          <td class="py-2 pr-4">
            <code>d;yyMd</code>
          </td>
          <td class="py-2" text={format(m.date, "d;yyMd")} />
        </tr>
        <tr>
          <td class="py-2 pr-4">
            <code>d;DDDDyyyyMMMMd</code>
          </td>
          <td
            class="py-2"
            text={expr(m.date, (date) => Format.value(date, "d;DDDDyyyyMMMMd"))}
          />
        </tr>
      </tbody>
    </table>
  </div>
);
// @index-end
