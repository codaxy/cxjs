import { createModel } from "cx/data";
import { Controller, KeySelection } from "cx/ui";
import { Grid } from "cx/widgets";

// @model
interface Person {
  id: number;
  fullName: string;
  continent: string;
  browser: string;
  os: string;
  visits: number;
}

interface PageModel {
  records: Person[];
  selection: Record<number, boolean>;
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller<typeof m> {
  onInit() {
    this.store.set(
      m.records,
      Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        fullName: ["John Doe", "Jane Smith", "Bob Wilson", "Alice Brown", "Charlie Davis"][i % 5],
        continent: ["Europe", "North America", "Asia", "Africa", "Australia"][i % 5],
        browser: ["Chrome", "Firefox", "Safari", "Edge"][i % 4],
        os: ["Windows", "macOS", "Linux", "iOS", "Android"][i % 5],
        visits: Math.floor(Math.random() * 100) + 1,
      }))
    );
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <Grid
      records={m.records}
      style="height: 400px"
      scrollable
      columns={[
        { header: "Name", field: "fullName", sortable: true },
        { header: "Continent", field: "continent", sortable: true },
        { header: "Browser", field: "browser", sortable: true },
        { header: "OS", field: "os", sortable: true },
        {
          header: "Visits",
          field: "visits",
          sortable: true,
          align: "right",
        },
      ]}
      selection={{ type: KeySelection, bind: m.selection, keyField: "id", multiple: true }}
    />
  </div>
);
// @index-end
