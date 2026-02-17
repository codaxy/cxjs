import { Grouper, createModel, GroupResult } from "cx/data";
import { Controller } from "cx/ui";
import { Grid } from "cx/widgets";

// @model
interface Sale {
  region: string;
  product: string;
  amount: number;
  quantity: number;
}

interface Model {
  sales: Sale[];
  grouped: GroupResult[];
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.sales, [
      { region: "North", product: "Widget", amount: 100, quantity: 5 },
      { region: "North", product: "Gadget", amount: 200, quantity: 3 },
      { region: "South", product: "Widget", amount: 150, quantity: 7 },
      { region: "South", product: "Gadget", amount: 80, quantity: 2 },
      { region: "East", product: "Widget", amount: 120, quantity: 4 },
      { region: "East", product: "Gadget", amount: 90, quantity: 6 },
    ]);
    this.computeGroups();
  }

  computeGroups() {
    const sales = this.store.get(m.sales);

    const grouper = new Grouper(
      { region: (s: Sale) => s.region },
      {
        totalAmount: { type: "sum", value: (s: Sale) => s.amount },
        totalQty: { type: "sum", value: (s: Sale) => s.quantity },
        avgAmount: { type: "avg", value: (s: Sale) => s.amount },
      },
    );

    grouper.processAll(sales);
    this.store.set(m.grouped, grouper.getResults());
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <h4 style="margin: 0 0 8px">Sales Data</h4>
    <Grid
      records={m.sales}
      columns={[
        { header: "Region", field: "region" },
        { header: "Product", field: "product" },
        { header: "Amount", field: "amount", format: "currency", align: "right" },
        { header: "Qty", field: "quantity", align: "right" },
      ]}
    />

    <h4 style="margin: 16px 0 8px">Grouped by Region</h4>
    <Grid
      records={m.grouped}
      columns={[
        { header: "Region", field: "key.region" },
        { header: "Total Amount", field: "aggregates.totalAmount", format: "currency", align: "right" },
        { header: "Total Qty", field: "aggregates.totalQty", align: "right" },
        { header: "Avg Amount", field: "aggregates.avgAmount", format: "currency", align: "right" },
        { header: "Records", field: "records.length", align: "right" },
      ]}
    />
  </div>
);
// @index-end
