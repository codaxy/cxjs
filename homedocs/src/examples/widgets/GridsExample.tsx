/** @jsxImportSource cx */
import { Grid } from "cx/widgets";
import { Controller, KeySelection } from "cx/ui";
import { $page } from "../stores.js";

class PageController extends Controller {
  onInit() {
    this.store.set("records", [
      { id: 1, name: "John Doe", city: "New York", visits: 42 },
      { id: 2, name: "Jane Smith", city: "London", visits: 87 },
      { id: 3, name: "Bob Johnson", city: "Paris", visits: 23 },
      { id: 4, name: "Alice Brown", city: "Tokyo", visits: 65 },
      { id: 5, name: "Charlie Wilson", city: "Berlin", visits: 31 },
    ]);
  }
}

export default () => (
  <cx>
    <div controller={PageController}>
      <Grid
        records={$page.records}
        style={{ width: "100%" }}
        columns={[
          { header: "Name", field: "name", sortable: true },
          { header: "City", field: "city", sortable: true },
          {
            header: "Visits",
            field: "visits",
            sortable: true,
            align: "right",
          },
        ]}
        selection={{ type: KeySelection, bind: $page.selection }}
      />
    </div>
  </cx>
);
