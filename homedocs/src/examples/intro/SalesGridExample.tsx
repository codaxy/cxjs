import {
  Controller,
  createModel,
  enableCultureSensitiveFormatting,
  expr,
  tpl,
} from "cx/ui";
import { Grid } from "cx/widgets";

enableCultureSensitiveFormatting();

// @model
interface SaleRecord {
  region: string;
  product: string;
  qty: number;
  revenue: number;
}

interface PageModel {
  sales: SaleRecord[];
  $record: SaleRecord;
  $group: {
    region: string;
    productCount: number;
  };
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.sales, [
      { region: "Europe", product: "Widget A", qty: 50, revenue: 2500 },
      { region: "Europe", product: "Widget B", qty: 30, revenue: 1800 },
      { region: "Europe", product: "Gadget X", qty: 20, revenue: 3200 },
      { region: "Americas", product: "Widget A", qty: 80, revenue: 4000 },
      { region: "Americas", product: "Widget B", qty: 45, revenue: 2700 },
      { region: "Americas", product: "Gadget X", qty: 35, revenue: 5600 },
      { region: "Asia", product: "Widget A", qty: 120, revenue: 6000 },
      { region: "Asia", product: "Widget B", qty: 60, revenue: 3600 },
      { region: "Asia", product: "Gadget X", qty: 40, revenue: 6400 },
    ]);
  }
}
// @controller-end

// @index
export default (
  <Grid
    controller={PageController}
    records={m.sales}
    columns={[
      {
        header: "Product",
        field: "product",
        sortable: true,
        aggregate: "count",
        aggregateAlias: "productCount",
        caption: m.$group.region,
        footer: tpl(m.$group.productCount, "{0} products"),
      },
      {
        header: "Qty",
        field: "qty",
        sortable: true,
        align: "right",
        format: "n;0",
        aggregate: "sum",
      },
      {
        header: "Revenue",
        field: "revenue",
        sortable: true,
        align: "right",
        format: "currency;USD;0",
        aggregate: "sum",
      },
    ]}
    grouping={[
      { showFooter: true },
      {
        key: { region: m.$record.region },
        showCaption: true,
      },
    ]}
  />
);
// @index-end
