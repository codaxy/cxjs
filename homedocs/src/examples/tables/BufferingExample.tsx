import { createModel } from "cx/data";
import { Controller, KeySelection } from "cx/ui";
import { Grid } from "cx/widgets";

// @model
interface Record {
  id: number;
  fullName: string;
  continent: string;
  browser: string;
  visits: number;
}

interface PageModel {
  records: Record[];
  selection: number;
}

const m = createModel<PageModel>();
// @model-end

const names = [
  "Alice Johnson",
  "Bob Smith",
  "Carol White",
  "David Brown",
  "Eva Green",
];
const continents = [
  "North America",
  "Europe",
  "Asia",
  "South America",
  "Africa",
];
const browsers = ["Chrome", "Firefox", "Safari", "Edge", "Opera"];

// @controller
class PageController extends Controller<typeof m> {
  onInit() {
    this.store.init(
      m.records,
      Array.from({ length: 5000 }, (_, i) => ({
        id: i + 1,
        fullName: names[i % 5],
        continent: continents[i % 5],
        browser: browsers[i % 5],
        visits: Math.floor(Math.random() * 100) + 1,
      })),
    );
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController}>
    <Grid
      records={m.records}
      keyField="id"
      buffered
      style="height: 400px"
      mod={["fixed-layout", "contain"]}
      cached
      selection={{ type: KeySelection, bind: m.selection }}
      columns={[
        {
          header: "#",
          align: "center",
          children: <div class="cxe-grid-row-number" />,
          defaultWidth: 70,
        },
        {
          header: { text: "Name", style: "width: 100%" },
          field: "fullName",
          sortable: true,
          resizable: true,
        },
        {
          header: "Continent",
          field: "continent",
          sortable: true,
          resizable: true,
          defaultWidth: 130,
        },
        {
          header: "Browser",
          field: "browser",
          sortable: true,
          resizable: true,
          defaultWidth: 100,
        },
        {
          header: "Visits",
          field: "visits",
          sortable: true,
          align: "right",
          resizable: true,
          defaultWidth: 70,
        },
      ]}
    />
  </div>
);
// @index-end
