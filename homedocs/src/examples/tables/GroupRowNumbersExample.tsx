import { createModel } from "cx/data";
import { Controller, tpl } from "cx/ui";
import { Grid } from "cx/widgets";

// @model
interface Person {
  id: number;
  fullName: string;
  continent: string;
  visits: number;
}

interface GroupData {
  $name: string;
  $level: number;
  continent: string;
  fullName: number;
}

interface PageModel {
  records: Person[];
  $record: Person;
  $group: GroupData;
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
        visits: 45,
      },
      { id: 2, fullName: "Bob Smith", continent: "North America", visits: 32 },
      {
        id: 3,
        fullName: "Henry Taylor",
        continent: "North America",
        visits: 25,
      },
      { id: 4, fullName: "Carol White", continent: "Europe", visits: 28 },
      { id: 5, fullName: "David Brown", continent: "Europe", visits: 51 },
      { id: 6, fullName: "Eva Green", continent: "Europe", visits: 19 },
      { id: 7, fullName: "Frank Wilson", continent: "Asia", visits: 37 },
      { id: 8, fullName: "Grace Lee", continent: "Asia", visits: 42 },
    ]);
  }
}
// @controller-end

// @index
export default (
  <Grid
    controller={PageController}
    records={m.records}
    sortField="visits"
    sortDirection="DESC"
    grouping={[
      {
        key: { continent: m.$record.continent },
        showCaption: true,
        resetRowNumbers: true,
      },
    ]}
    columns={[
      {
        header: "#",
        defaultWidth: 50,
        align: "right",
        children: <div class="cxe-grid-row-number" />,
      },
      {
        header: "Name",
        field: "fullName",
        caption: m.$group.continent,
      },
      { header: "Visits", field: "visits", align: "right" },
    ]}
    recordAlias={m.$record}
  />
);
// @index-end
