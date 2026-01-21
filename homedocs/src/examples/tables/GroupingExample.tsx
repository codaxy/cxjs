import { createModel } from "cx/data";
import { Controller, tpl } from "cx/ui";
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

interface GroupData {
  $name: string;
  $level: number;
  fullName: number;
  browsers: number;
  os: number;
  visits: number;
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
        browser: "Chrome",
        os: "Windows",
        visits: 45,
      },
      {
        id: 2,
        fullName: "Bob Smith",
        continent: "North America",
        browser: "Firefox",
        os: "macOS",
        visits: 32,
      },
      {
        id: 3,
        fullName: "Carol White",
        continent: "Europe",
        browser: "Chrome",
        os: "Linux",
        visits: 28,
      },
      {
        id: 4,
        fullName: "David Brown",
        continent: "Europe",
        browser: "Safari",
        os: "macOS",
        visits: 51,
      },
      {
        id: 5,
        fullName: "Eva Green",
        continent: "Europe",
        browser: "Chrome",
        os: "Windows",
        visits: 19,
      },
      {
        id: 6,
        fullName: "Frank Wilson",
        continent: "Asia",
        browser: "Edge",
        os: "Windows",
        visits: 37,
      },
      {
        id: 7,
        fullName: "Grace Lee",
        continent: "Asia",
        browser: "Chrome",
        os: "macOS",
        visits: 42,
      },
      {
        id: 8,
        fullName: "Henry Taylor",
        continent: "North America",
        browser: "Safari",
        os: "macOS",
        visits: 25,
      },
    ]);
  }
}
// @controller-end

// @index
export default () => (
  <Grid
    controller={PageController}
    records={m.records}
    style="height: 500px"
    scrollable
    border
    grouping={[{ key: {}, showFooter: true }, "continent"]}
    columns={[
      {
        header: "Name",
        field: "fullName",
        aggregate: "count",
        footer: tpl(m.$group.fullName, "{0} people"),
      },
      {
        header: "Browser",
        field: "browser",
        aggregate: "distinct",
        aggregateAlias: "browsers",
        footer: tpl(m.$group.browsers, "{0} browsers"),
      },
      {
        header: "OS",
        field: "os",
        aggregate: "distinct",
        footer: tpl(m.$group.os, "{0} OS"),
      },
      {
        header: "Visits",
        field: "visits",
        align: "right",
        aggregate: "sum",
      },
    ]}
    recordAlias={m.$record}
  />
);
// @index-end
