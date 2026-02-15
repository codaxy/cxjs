import { createModel } from "cx/data";
import { Controller } from "cx/ui";
import { Grid, NumberField, TextField, LookupField } from "cx/widgets";

// @model
interface Person {
  id: number;
  fullName: string;
  continent: string;
  browser: string;
  visits: number;
}

interface PageModel {
  records: Person[];
  $record: Person;
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.records, [
      {
        id: 1,
        fullName: "Alice Johnson",
        continent: "North America",
        browser: "Chrome",
        visits: 45,
      },
      {
        id: 2,
        fullName: "Bob Smith",
        continent: "Europe",
        browser: "Firefox",
        visits: 32,
      },
      {
        id: 3,
        fullName: "Carol White",
        continent: "Asia",
        browser: "Safari",
        visits: 28,
      },
      {
        id: 4,
        fullName: "David Brown",
        continent: "Europe",
        browser: "Edge",
        visits: 51,
      },
      {
        id: 5,
        fullName: "Eva Green",
        continent: "North America",
        browser: "Chrome",
        visits: 19,
      },
      {
        id: 6,
        fullName: "Frank Wilson",
        continent: "Asia",
        browser: "Firefox",
        visits: 37,
      },
      {
        id: 7,
        fullName: "Grace Lee",
        continent: "Europe",
        browser: "Chrome",
        visits: 42,
      },
      {
        id: 8,
        fullName: "Henry Taylor",
        continent: "North America",
        browser: "Safari",
        visits: 25,
      },
    ]);
  }
}
// @controller-end

const continentOptions = [
  { id: "Africa", text: "Africa" },
  { id: "Asia", text: "Asia" },
  { id: "Europe", text: "Europe" },
  { id: "North America", text: "North America" },
  { id: "South America", text: "South America" },
];

const browserOptions = [
  { id: "Chrome", text: "Chrome" },
  { id: "Firefox", text: "Firefox" },
  { id: "Safari", text: "Safari" },
  { id: "Edge", text: "Edge" },
];

// @index
export default (
  <Grid
    controller={PageController}
    records={m.records}
    style="height: 400px"
    scrollable
    cellEditable
    lockColumnWidths
    onCellEdited={(change, record) => {
      console.log("Cell edited:", change, record);
    }}
    columns={[
      {
        header: "Name",
        field: "fullName",
        editor: <TextField value={m.$record.fullName} required visited />,
      },
      {
        header: "Continent",
        field: "continent",
        editor: (
          <LookupField
            value={m.$record.continent}
            options={continentOptions}
            required
            autoOpen
            submitOnEnterKey
          />
        ),
      },
      {
        header: "Browser",
        field: "browser",
        editor: (
          <LookupField
            value={m.$record.browser}
            options={browserOptions}
            required
            autoOpen
            submitOnEnterKey
          />
        ),
      },
      {
        header: "Visits",
        field: "visits",
        align: "right",
        editor: (
          <NumberField
            value={m.$record.visits}
            required
            visited
            inputStyle="text-align: right"
          />
        ),
      },
    ]}
    recordAlias={m.$record}
  />
);
// @index-end
