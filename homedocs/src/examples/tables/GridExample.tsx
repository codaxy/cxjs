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
class PageController extends Controller {
  onInit() {
    this.store.set(m.records, [
      { id: 1, fullName: "James Peterson", continent: "North America", browser: "Chrome", os: "Windows", visits: 67 },
      { id: 2, fullName: "Olivia Chen", continent: "Asia", browser: "Firefox", os: "macOS", visits: 34 },
      { id: 3, fullName: "Liam Novak", continent: "Europe", browser: "Safari", os: "iOS", visits: 91 },
      { id: 4, fullName: "Sophia Martinez", continent: "South America", browser: "Edge", os: "Windows", visits: 12 },
      { id: 5, fullName: "Noah Williams", continent: "North America", browser: "Chrome", os: "Linux", visits: 55 },
      { id: 6, fullName: "Emma Johansson", continent: "Europe", browser: "Firefox", os: "Windows", visits: 78 },
      { id: 7, fullName: "Ethan Okafor", continent: "Africa", browser: "Chrome", os: "Android", visits: 23 },
      { id: 8, fullName: "Ava Tanaka", continent: "Asia", browser: "Safari", os: "macOS", visits: 45 },
      { id: 9, fullName: "Lucas Bernard", continent: "Europe", browser: "Edge", os: "Windows", visits: 89 },
      { id: 10, fullName: "Mia Kowalski", continent: "Europe", browser: "Chrome", os: "Linux", visits: 31 },
      { id: 11, fullName: "Mason Rivera", continent: "South America", browser: "Firefox", os: "Android", visits: 62 },
      { id: 12, fullName: "Isabella Singh", continent: "Asia", browser: "Chrome", os: "Windows", visits: 17 },
      { id: 13, fullName: "Logan Murphy", continent: "Australia", browser: "Safari", os: "macOS", visits: 74 },
      { id: 14, fullName: "Charlotte Kim", continent: "Asia", browser: "Edge", os: "Windows", visits: 48 },
      { id: 15, fullName: "Alexander Muller", continent: "Europe", browser: "Firefox", os: "Linux", visits: 93 },
      { id: 16, fullName: "Amelia Scott", continent: "North America", browser: "Chrome", os: "macOS", visits: 26 },
      { id: 17, fullName: "Benjamin Rossi", continent: "Europe", browser: "Safari", os: "iOS", visits: 58 },
      { id: 18, fullName: "Harper Mensah", continent: "Africa", browser: "Chrome", os: "Android", visits: 41 },
      { id: 19, fullName: "Daniel Larsson", continent: "Europe", browser: "Edge", os: "Windows", visits: 85 },
      { id: 20, fullName: "Evelyn Nakamura", continent: "Asia", browser: "Firefox", os: "macOS", visits: 39 },
    ]);
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
      selection={{
        type: KeySelection,
        bind: m.selection,
        keyField: "id",
        multiple: true,
      }}
    />
  </div>
);
// @index-end
