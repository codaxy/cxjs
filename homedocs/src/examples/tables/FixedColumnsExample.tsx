import { createModel } from "cx/data";
import { Controller, format, tpl } from "cx/ui";
import { Grid } from "cx/widgets";

// @model
interface Person {
  id: number;
  fullName: string;
  continent: string;
  browser: string;
  os: string;
  visits: number;
  lastVisit: string;
  revenue: number;
}

interface GroupData {
  id: number;
  continent: number;
  browser: number;
  os: number;
  visits: number;
  revenue: number;
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
        continent: "Europe",
        browser: "Chrome",
        os: "Windows",
        visits: 45,
        lastVisit: "2024-01-15",
        revenue: 1250,
      },
      {
        id: 2,
        fullName: "Bob Smith",
        continent: "Asia",
        browser: "Firefox",
        os: "macOS",
        visits: 23,
        lastVisit: "2024-01-14",
        revenue: 890,
      },
      {
        id: 3,
        fullName: "Carol White",
        continent: "North America",
        browser: "Safari",
        os: "macOS",
        visits: 67,
        lastVisit: "2024-01-13",
        revenue: 2100,
      },
      {
        id: 4,
        fullName: "David Brown",
        continent: "Europe",
        browser: "Chrome",
        os: "Linux",
        visits: 12,
        lastVisit: "2024-01-12",
        revenue: 450,
      },
      {
        id: 5,
        fullName: "Eva Green",
        continent: "Asia",
        browser: "Edge",
        os: "Windows",
        visits: 89,
        lastVisit: "2024-01-11",
        revenue: 3200,
      },
      {
        id: 6,
        fullName: "Frank Miller",
        continent: "Europe",
        browser: "Chrome",
        os: "Windows",
        visits: 34,
        lastVisit: "2024-01-10",
        revenue: 980,
      },
      {
        id: 7,
        fullName: "Grace Lee",
        continent: "Asia",
        browser: "Safari",
        os: "macOS",
        visits: 56,
        lastVisit: "2024-01-09",
        revenue: 1540,
      },
      {
        id: 8,
        fullName: "Henry Wilson",
        continent: "North America",
        browser: "Firefox",
        os: "Linux",
        visits: 28,
        lastVisit: "2024-01-08",
        revenue: 720,
      },
      {
        id: 9,
        fullName: "Iris Chen",
        continent: "Asia",
        browser: "Chrome",
        os: "Windows",
        visits: 91,
        lastVisit: "2024-01-07",
        revenue: 2890,
      },
      {
        id: 10,
        fullName: "Jack Davis",
        continent: "Europe",
        browser: "Edge",
        os: "Windows",
        visits: 15,
        lastVisit: "2024-01-06",
        revenue: 560,
      },
      {
        id: 11,
        fullName: "Karen Taylor",
        continent: "North America",
        browser: "Chrome",
        os: "macOS",
        visits: 73,
        lastVisit: "2024-01-05",
        revenue: 2340,
      },
      {
        id: 12,
        fullName: "Leo Martinez",
        continent: "Europe",
        browser: "Firefox",
        os: "Linux",
        visits: 42,
        lastVisit: "2024-01-04",
        revenue: 1120,
      },
      {
        id: 13,
        fullName: "Mia Anderson",
        continent: "Asia",
        browser: "Safari",
        os: "macOS",
        visits: 38,
        lastVisit: "2024-01-03",
        revenue: 1450,
      },
      {
        id: 14,
        fullName: "Noah Thomas",
        continent: "North America",
        browser: "Chrome",
        os: "Windows",
        visits: 61,
        lastVisit: "2024-01-02",
        revenue: 1780,
      },
      {
        id: 15,
        fullName: "Olivia Jackson",
        continent: "Europe",
        browser: "Edge",
        os: "Windows",
        visits: 19,
        lastVisit: "2024-01-01",
        revenue: 670,
      },
      {
        id: 16,
        fullName: "Paul Harris",
        continent: "Asia",
        browser: "Firefox",
        os: "Linux",
        visits: 84,
        lastVisit: "2023-12-31",
        revenue: 2560,
      },
      {
        id: 17,
        fullName: "Quinn Martin",
        continent: "North America",
        browser: "Chrome",
        os: "macOS",
        visits: 52,
        lastVisit: "2023-12-30",
        revenue: 1890,
      },
      {
        id: 18,
        fullName: "Rachel Garcia",
        continent: "Europe",
        browser: "Safari",
        os: "macOS",
        visits: 31,
        lastVisit: "2023-12-29",
        revenue: 920,
      },
      {
        id: 19,
        fullName: "Sam Robinson",
        continent: "Asia",
        browser: "Chrome",
        os: "Windows",
        visits: 77,
        lastVisit: "2023-12-28",
        revenue: 2210,
      },
      {
        id: 20,
        fullName: "Tina Clark",
        continent: "North America",
        browser: "Firefox",
        os: "Linux",
        visits: 46,
        lastVisit: "2023-12-27",
        revenue: 1350,
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
    scrollable
    border
    style="height: 500px"
    lockColumnWidths
    fixedFooter
    mod="fixed-layout"
    columns={[
      {
        header: "#",
        field: "id",
        fixed: true,
        sortable: true,
        resizable: true,
        aggregate: "count",
        footer: { value: tpl(m.$group.id, "{0} records"), colSpan: 2 },
      },
      {
        header: "Name",
        field: "fullName",
        fixed: true,
        sortable: true,
        resizable: true,
        defaultWidth: 150,
      },
      {
        header: "Continent",
        field: "continent",
        sortable: true,
        resizable: true,
        defaultWidth: 120,
        aggregate: "distinct",
        footer: tpl(m.$group.continent, "{0} continents"),
      },
      {
        header: "Browser",
        field: "browser",
        sortable: true,
        resizable: true,
        defaultWidth: 100,
        aggregate: "distinct",
        footer: tpl(m.$group.browser, "{0} browsers"),
      },
      {
        header: "OS",
        field: "os",
        sortable: true,
        resizable: true,
        defaultWidth: 100,
        aggregate: "distinct",
        footer: tpl(m.$group.os, "{0} OSs"),
      },
      {
        header: "Visits",
        field: "visits",
        sortable: true,
        resizable: true,
        align: "right",
        defaultWidth: 80,
        aggregate: "sum",
        footer: m.$group.visits,
      },
      {
        header: "Revenue",
        field: "revenue",
        sortable: true,
        resizable: true,
        align: "right",
        format: "currency;USD;0",
        defaultWidth: 100,
        aggregate: "sum",
        footer: format(m.$group.revenue, "currency;USD;0"),
      },
    ]}
  />
);
// @index-end
