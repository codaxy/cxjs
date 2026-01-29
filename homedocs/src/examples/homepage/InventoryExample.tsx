import { createModel } from "cx/data";
import { Controller, expr } from "cx/ui";
import { Grid, NumberField } from "cx/widgets";

// @model
interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  stock: number;
  reorderPoint: number;
  unitPrice: number;
}

interface InventoryModel {
  products: Product[];
  $record: Product;
  $group: { category: string };
}

const m = createModel<InventoryModel>();
// @model-end

function getStockStatus(stock: number, reorderPoint: number) {
  if (stock === 0)
    return {
      label: "Out of Stock",
      class: "bg-red-500/20 text-red-600 dark:text-red-400",
    };
  if (stock <= reorderPoint)
    return {
      label: "Low Stock",
      class: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
    };
  return {
    label: "In Stock",
    class: "bg-green-500/20 text-green-600 dark:text-green-400",
  };
}

// @controller
class InventoryController extends Controller {
  onInit() {
    this.store.set(m.products, [
      {
        id: 1,
        sku: "CPU-001",
        name: "Intel Core i5-13400",
        category: "CPU",
        stock: 24,
        reorderPoint: 10,
        unitPrice: 200,
      },
      {
        id: 2,
        sku: "CPU-002",
        name: "AMD Ryzen 7 7800X3D",
        category: "CPU",
        stock: 8,
        reorderPoint: 10,
        unitPrice: 350,
      },
      {
        id: 3,
        sku: "RAM-001",
        name: "Corsair Vengeance 32GB DDR5",
        category: "RAM",
        stock: 45,
        reorderPoint: 20,
        unitPrice: 120,
      },
      {
        id: 4,
        sku: "RAM-002",
        name: "G.Skill Trident Z5 64GB DDR5",
        category: "RAM",
        stock: 3,
        reorderPoint: 5,
        unitPrice: 280,
      },
      {
        id: 5,
        sku: "SSD-001",
        name: "Samsung 990 Pro 1TB",
        category: "SSD",
        stock: 0,
        reorderPoint: 15,
        unitPrice: 150,
      },
      {
        id: 6,
        sku: "SSD-002",
        name: "WD Black SN850X 2TB",
        category: "SSD",
        stock: 18,
        reorderPoint: 10,
        unitPrice: 200,
      },
      {
        id: 7,
        sku: "GPU-001",
        name: "NVIDIA RTX 4070 Super",
        category: "GPU",
        stock: 5,
        reorderPoint: 5,
        unitPrice: 600,
      },
      {
        id: 8,
        sku: "GPU-002",
        name: "NVIDIA RTX 4080 Super",
        category: "GPU",
        stock: 12,
        reorderPoint: 8,
        unitPrice: 1000,
      },
    ]);
  }
}
// @controller-end

// @index
export default (
  <div
    controller={InventoryController}
    class="p-5 h-full min-h-[450px] relative box-border bg-card rounded-lg max-w-4xl mx-auto"
  >
    <h3 class="m-0 mb-3 text-lg font-semibold">Product Inventory</h3>
    <Grid
      records={m.products}
      keyField="id"
      scrollable
      cellEditable
      grouping={[
        {
          key: { category: m.$record.category },
          caption: m.$group.category,
        },
      ]}
      columns={[
        {
          header: "SKU",
          field: "sku",
          style: "width: 90px; font-family: monospace",
        },
        {
          header: "Product",
          field: "name",
          style: "min-width: 200px",
        },
        {
          header: "Stock",
          field: "stock",
          align: "right",
          style: "width: 80px",
          editor: (
            <NumberField
              value={m.$record.stock}
              style="width: 100%"
              inputStyle="text-align: right"
            />
          ),
        },
        {
          header: "Reorder At",
          field: "reorderPoint",
          align: "right",
          style: "width: 90px",
          editor: (
            <NumberField
              value={m.$record.reorderPoint}
              style="width: 100%"
              inputStyle="text-align: right"
            />
          ),
        },
        {
          header: "Unit Price",
          field: "unitPrice",
          align: "right",
          format: "currency;;0",
          style: "width: 100px",
        },
        {
          header: "Status",
          style: "width: 110px",
          align: "center",
          value: expr(
            m.$record.stock,
            m.$record.reorderPoint,
            (stock, reorder) => getStockStatus(stock, reorder).label,
          ),
          class: expr(
            m.$record.stock,
            m.$record.reorderPoint,
            (stock, reorder) => getStockStatus(stock, reorder).class,
          ),
        },
      ]}
    />
    <p class="text-sm text-muted-foreground mt-3">
      Double-click Stock or Reorder At cells to edit
    </p>
  </div>
);
// @index-end
