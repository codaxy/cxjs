import { createModel } from "cx/data";
import { Controller, expr } from "cx/ui";
import { getSearchQueryPredicate } from "cx/util";
import { HighlightedSearchText, Repeater, TextField } from "cx/widgets";

// @model
interface Product {
  name: string;
  price: number;
}

interface PageModel {
  products: Product[];
  $record: Product;
  search: string;
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.init(m.products, [
      { name: "Banana", price: 1.2 },
      { name: "Apple", price: 0.9 },
      { name: "Orange", price: 1.5 },
      { name: "Mango", price: 2.3 },
      { name: "Pineapple", price: 3.5 },
      { name: "Strawberry", price: 4.0 },
      { name: "Grapes", price: 2.8 },
      { name: "Watermelon", price: 5.0 },
    ]);
  }
}
// @controller-end

// @index
export default (
  <div class="flex flex-col gap-4" controller={PageController}>
    <TextField value={m.search} placeholder="Filter by name..." />
    <Repeater
      records={m.products}
      recordAlias={m.$record}
      sortField="name"
      sortDirection="ASC"
      filterParams={{ search: m.search }}
      onCreateFilter={(params) => {
        let predicate = getSearchQueryPredicate(params.search);
        return (item: Product) => predicate(item.name);
      }}
    >
      <div class="text-sm">
        <HighlightedSearchText text={m.$record.name} query={m.search} />
        <span text={expr(m.$record.price, (price) => ` - $${price}`)} />
      </div>
    </Repeater>
  </div>
);
// @index-end
