import { createModel } from "cx/data";
import { Controller } from "cx/ui";
import { Grid, LookupField } from "cx/widgets";

// @model
interface Person {
  id: number;
  fullName: string;
  continent: string;
  browser: string;
  visits: number;
}

interface ColumnOption {
  id: string;
  text: string;
}

interface Column {
  header: string;
  field: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
}

interface PageModel {
  records: Person[];
  visibleColumns: string[];
  $record: Person;
}

const m = createModel<PageModel>();
// @model-end

// @columns
const columnOptions: ColumnOption[] = [
  { id: "fullName", text: "Name" },
  { id: "continent", text: "Continent" },
  { id: "browser", text: "Browser" },
  { id: "visits", text: "Visits" },
];

const allColumns: Column[] = [
  { header: "Name", field: "fullName", sortable: true },
  { header: "Continent", field: "continent", sortable: true },
  { header: "Browser", field: "browser", sortable: true },
  { header: "Visits", field: "visits", sortable: true, align: "right" },
];
// @columns-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.records, [
      { id: 1, fullName: "Alice Johnson", continent: "Europe", browser: "Chrome", visits: 45 },
      { id: 2, fullName: "Bob Smith", continent: "Asia", browser: "Firefox", visits: 23 },
      { id: 3, fullName: "Carol White", continent: "North America", browser: "Safari", visits: 67 },
      { id: 4, fullName: "David Brown", continent: "Europe", browser: "Chrome", visits: 12 },
      { id: 5, fullName: "Eva Green", continent: "Asia", browser: "Edge", visits: 89 },
    ]);

    this.store.init(m.visibleColumns, ["fullName", "continent", "browser", "visits"]);
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController}>
    <div class="mb-4 flex items-center gap-2">
      <span>Visible Columns:</span>
      <LookupField values={m.visibleColumns} options={columnOptions} multiple style="width: 300px" />
    </div>

    <Grid
      records={m.records}
      style="width: 100%"
      border
      columnParams={m.visibleColumns}
      onGetColumns={(visibleColumns: string[]) =>
        allColumns.filter((c) => visibleColumns.includes(c.field))
      }
    />
  </div>
);
// @index-end
