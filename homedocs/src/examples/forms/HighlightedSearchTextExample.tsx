import { createModel } from "cx/data";
import { Controller } from "cx/ui";
import { TextField, List, HighlightedSearchText } from "cx/widgets";
import { getSearchQueryPredicate } from "cx/util";

// @model
interface City {
  text: string;
}

interface PageModel {
  query: string;
  cities: City[];
  $record: City;
}

const m = createModel<PageModel>();
// @model-end

class PageController extends Controller {
  onInit() {
    this.store.set(m.cities, [
      { text: "New York" },
      { text: "Los Angeles" },
      { text: "Chicago" },
      { text: "Houston" },
      { text: "Phoenix" },
    ]);
  }
}

// @index
export default () => (
  <div controller={PageController}>
    <TextField
      value={m.query}
      placeholder="Type to search..."
      className="mb-4"
    />
    <List
      records={m.cities}
      mod="bordered"
      style="width: 200px;"
      filterParams={m.query}
      onCreateFilter={(query: string) => {
        let predicate = getSearchQueryPredicate(query);
        return (record: { text: string }) => predicate(record.text);
      }}
    >
      <HighlightedSearchText text={m.$record.text} query={m.query} />
    </List>
  </div>
);
// @index-end
