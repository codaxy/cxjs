import { createModel, updateArray } from "cx/data";
import { Controller, Instance, tpl, expr } from "cx/ui";
import { Grid, Button, LookupField, NumberField } from "cx/widgets";

// @model
interface Product {
  id: string;
  name: string;
  unitPrice: number;
  taxPct: number;
  category: string;
}

interface InvoiceItem {
  id: number;
  itemId: string | null;
  qty: number;
  unitPrice: number;
  taxPct: number;
  discountPct: number;
  regularAmount: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
}

interface InvoiceModel {
  items: InvoiceItem[];
  products: Product[];
  total: {
    regularAmount: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
  };
  $record: InvoiceItem;
  $index: number;
  $option: Product;
  $group: { category: string };
}

const m = createModel<InvoiceModel>();
// @model-end

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

let nextId = 100;

// @controller
class InvoiceController extends Controller {
  onInit() {
    this.store.set(m.products, [
      {
        id: "cpu1",
        name: "Intel Core i5-13400",
        unitPrice: 200,
        taxPct: 20,
        category: "CPU",
      },
      {
        id: "cpu2",
        name: "Intel Core i7-13700K",
        unitPrice: 350,
        taxPct: 20,
        category: "CPU",
      },
      {
        id: "cpu3",
        name: "AMD Ryzen 9 7950X",
        unitPrice: 500,
        taxPct: 20,
        category: "CPU",
      },
      {
        id: "ram1",
        name: "Corsair Vengeance 16GB DDR5",
        unitPrice: 100,
        taxPct: 20,
        category: "RAM",
      },
      {
        id: "ram2",
        name: "G.Skill Trident Z5 32GB DDR5",
        unitPrice: 200,
        taxPct: 20,
        category: "RAM",
      },
      {
        id: "ram3",
        name: "Kingston Fury Beast 64GB DDR5",
        unitPrice: 400,
        taxPct: 20,
        category: "RAM",
      },
      {
        id: "ssd1",
        name: "Samsung 970 EVO Plus 500GB",
        unitPrice: 200,
        taxPct: 20,
        category: "SSD",
      },
      {
        id: "ssd2",
        name: "WD Black SN850X 1TB",
        unitPrice: 300,
        taxPct: 20,
        category: "SSD",
      },
      {
        id: "ssd3",
        name: "Seagate FireCuda 530 2TB",
        unitPrice: 400,
        taxPct: 20,
        category: "SSD",
      },
      {
        id: "gpu1",
        name: "NVIDIA GeForce RTX 4060",
        unitPrice: 300,
        taxPct: 20,
        category: "GPU",
      },
      {
        id: "gpu2",
        name: "NVIDIA GeForce RTX 4070",
        unitPrice: 550,
        taxPct: 20,
        category: "GPU",
      },
      {
        id: "gpu3",
        name: "NVIDIA GeForce RTX 4080",
        unitPrice: 1100,
        taxPct: 20,
        category: "GPU",
      },
    ]);

    this.store.set(m.items, [
      {
        id: 1,
        itemId: "cpu1",
        qty: 1,
        unitPrice: 200,
        taxPct: 20,
        discountPct: 0,
        regularAmount: 0,
        discountAmount: 0,
        taxAmount: 0,
        totalAmount: 0,
      },
      {
        id: 2,
        itemId: "ram2",
        qty: 2,
        unitPrice: 200,
        taxPct: 20,
        discountPct: 0,
        regularAmount: 0,
        discountAmount: 0,
        taxAmount: 0,
        totalAmount: 0,
      },
      {
        id: 3,
        itemId: "ssd1",
        qty: 1,
        unitPrice: 200,
        taxPct: 20,
        discountPct: 10,
        regularAmount: 0,
        discountAmount: 0,
        taxAmount: 0,
        totalAmount: 0,
      },
    ]);

    // Calculate line items
    this.addTrigger(
      "line-calc",
      [m.items],
      () => {
        this.store.update(m.items, updateArray, (item: InvoiceItem) => {
          const regularAmount = round2((item.qty || 0) * (item.unitPrice || 0));
          const discountAmount = round2(
            (regularAmount * (item.discountPct || 0)) / 100,
          );
          const taxAmount = round2(
            ((regularAmount - discountAmount) * (item.taxPct || 0)) / 100,
          );
          const totalAmount = regularAmount - discountAmount + taxAmount;

          if (item.totalAmount === totalAmount) return item;

          return {
            ...item,
            regularAmount,
            discountAmount,
            taxAmount,
            totalAmount,
          };
        });
      },
      true,
    );

    // Compute totals
    this.addComputable(m.total, [m.items], (items: InvoiceItem[]) => {
      const total = {
        totalAmount: 0,
        taxAmount: 0,
        discountAmount: 0,
        regularAmount: 0,
      };
      if (!items) return total;
      items.forEach((item) => {
        total.totalAmount += item.totalAmount || 0;
        total.regularAmount += item.regularAmount || 0;
        total.discountAmount += item.discountAmount || 0;
        total.taxAmount += item.taxAmount || 0;
      });
      return total;
    });
  }

  onAddItemClick() {
    this.store.update(m.items, (items) => [
      ...items,
      {
        id: nextId++,
        itemId: null,
        qty: 1,
        unitPrice: 0,
        taxPct: 0,
        discountPct: 0,
        regularAmount: 0,
        discountAmount: 0,
        taxAmount: 0,
        totalAmount: 0,
      },
    ]);
  }

  onRemoveItemClick(_e: Event, { store }: Instance) {
    const id = store.get(m.$record.id);
    this.store.update(m.items, (items) =>
      items.filter((item) => item.id !== id),
    );
  }
}
// @controller-end

// @index
export default (
  <div
    controller={InvoiceController}
    class="p-5 h-full min-h-[450px] relative box-border bg-card rounded-lg max-w-5xl mx-auto"
  >
    <h3 class="m-0 mb-3 text-lg font-semibold">Invoice #333</h3>
    <Grid
      records={m.items}
      keyField="id"
      class="mb-4"
      columns={[
        {
          header: "#",
          value: expr(m.$index, (i) => (i ?? 0) + 1),
          style: "font-weight: bold; width: 40px",
          align: "center",
        },
        {
          header: "Product",
          field: "productName",
          style: "min-width: 180px",
          items: (
            <LookupField
              value={m.$record.itemId}
              style="width:100%;"
              options={m.products}
              required
              optionTextField="name"
              autoFocus={expr(m.$record.itemId, (id) => !id)}
              bindings={[
                { local: m.$record.itemId, remote: m.$option.id, key: true },
                { local: m.$record.unitPrice, remote: m.$option.unitPrice },
                { local: m.$record.taxPct, remote: m.$option.taxPct },
              ]}
              listOptions={{
                grouping: [
                  {
                    key: { category: m.$option.category },
                    header: (
                      <h6
                        text={m.$group.category}
                        class="m-0 py-1 px-2 text-xs uppercase text-muted-foreground bg-muted"
                      />
                    ),
                  },
                ],
              }}
            />
          ),
          footer: "Total",
        },
        {
          header: "Qty",
          field: "qty",
          align: "right",
          style: "width: 70px",
          items: (
            <NumberField
              value={m.$record.qty}
              style="width:100%"
              inputStyle="text-align: right"
              required
              reactOn="change"
            />
          ),
        },
        {
          header: { text: "Discount %", class: "whitespace-nowrap" },
          field: "discountPct",
          align: "right",
          style: "width: 80px",
          items: (
            <NumberField
              value={m.$record.discountPct}
              style="width:100%"
              inputStyle="text-align: right"
              format="ps"
              maxValue={100}
              reactOn="change"
            />
          ),
        },
        {
          header: "Unit Price",
          field: "unitPrice",
          align: "right",
          format: "currency;;2",
          style: "width: 90px",
        },
        {
          header: "Regular",
          field: "regularAmount",
          align: "right",
          format: "currency;;2",
          style: "width: 90px",
          footer: { tpl: "{total.regularAmount:currency;;2}" },
        },
        {
          header: "Discount",
          field: "discountAmount",
          align: "right",
          format: "currency;;2",
          style: "width: 90px",
          footer: { tpl: "{total.discountAmount:currency;;2}" },
        },
        {
          header: "Total",
          field: "totalAmount",
          align: "right",
          format: "currency;;2",
          style: "width: 90px",
          class: "bg-muted font-medium",
          footer: { tpl: "{total.totalAmount:currency;;2}" },
        },
        {
          align: "center",
          style: "width: 40px",
          items: (
            <Button onClick="onRemoveItemClick" mod="hollow" icon="close" />
          ),
        },
      ]}
    />

    <Button text="Add Item" mod="primary" onClick="onAddItemClick" />
  </div>
);
// @index-end
