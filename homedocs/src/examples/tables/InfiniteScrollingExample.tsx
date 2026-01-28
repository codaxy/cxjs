import { createModel } from "cx/data";
import { KeySelection } from "cx/ui";
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

// @index
export default (
  <Grid
    infinite
    style="height: 400px"
    lockColumnWidths
    cached
    keyField="id"
    selection={{ type: KeySelection, bind: m.selection, keyField: "id" }}
    onFetchRecords={({ page, pageSize }) =>
      new Promise<{ records: Record[]; totalRecordCount: number }>(
        (resolve) => {
          // Simulate server delay
          setTimeout(() => {
            const records: Record[] = [];
            for (let i = 0; i < pageSize; i++) {
              const id = (page - 1) * pageSize + i + 1;
              records.push({
                id,
                fullName: names[id % 5] + " " + id,
                continent: continents[id % 5],
                browser: browsers[id % 5],
                visits: Math.floor(Math.random() * 100) + 1,
              });
            }
            resolve({
              records,
              totalRecordCount: 10000,
            });
          }, 100);
        },
      )
    }
    columns={[
      {
        header: "#",
        field: "id",
        sortable: true,
        defaultWidth: 70,
        align: "center",
      },
      { header: "Name", field: "fullName", sortable: true },
      {
        header: "Continent",
        field: "continent",
        sortable: true,
        defaultWidth: 130,
      },
      {
        header: "Browser",
        field: "browser",
        sortable: true,
        defaultWidth: 100,
      },
      {
        header: "Visits",
        field: "visits",
        sortable: true,
        align: "right",
        defaultWidth: 70,
      },
    ]}
  />
);
// @index-end
