/** @jsxImportSource cx */
import { TextField, List, HighlightedSearchText } from "cx/widgets";
import { bind, Controller, LabelsTopLayout } from "cx/ui";
import { getSearchQueryPredicate } from "cx/util";

class PageController extends Controller {
  onInit() {
    this.store.set("cities", [
      { text: "New York" },
      { text: "Los Angeles" },
      { text: "Chicago" },
      { text: "Houston" },
      { text: "Phoenix" },
    ]);
  }
}

export default () => (
  <cx>
    <div controller={PageController}>
      <div layout={LabelsTopLayout} style="margin-bottom: 16px;">
        <TextField
          label="Search"
          value={bind("query")}
          placeholder="Type to search..."
        />
      </div>
      <List
        records-bind="cities"
        mod="bordered"
        style="width: 200px;"
        filterParams-bind="query"
        onCreateFilter={(query) => {
          let predicate = getSearchQueryPredicate(query);
          return (record) => predicate(record.text);
        }}
      >
        <HighlightedSearchText text-bind="$record.text" query-bind="query" />
      </List>
    </div>
  </cx>
);
