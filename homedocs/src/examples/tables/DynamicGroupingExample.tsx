import { createModel } from "cx/data";
import { Controller, tpl } from "cx/ui";
import { Grid, LookupField } from "cx/widgets";

// @model
interface Person {
  id: number;
  fullName: string;
  continent: string;
  browser: string;
  visits: number;
}

interface GroupOption {
  id: string;
  text: string;
}

interface GroupData {
  $name: string;
  $level: number;
  fullName: number;
  continents: number;
  browsers: number;
  visits: number;
}

interface PageModel {
  records: Person[];
  grouping: GroupOption[];
  groupableFields: GroupOption[];
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
        visits: 45,
      },
      {
        id: 2,
        fullName: "Bob Smith",
        continent: "North America",
        browser: "Firefox",
        visits: 32,
      },
      {
        id: 3,
        fullName: "Carol White",
        continent: "Europe",
        browser: "Chrome",
        visits: 28,
      },
      {
        id: 4,
        fullName: "David Brown",
        continent: "Europe",
        browser: "Safari",
        visits: 51,
      },
      {
        id: 5,
        fullName: "Eva Green",
        continent: "Europe",
        browser: "Chrome",
        visits: 19,
      },
      {
        id: 6,
        fullName: "Frank Wilson",
        continent: "Asia",
        browser: "Edge",
        visits: 37,
      },
      {
        id: 7,
        fullName: "Grace Lee",
        continent: "Asia",
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

    this.store.set(m.groupableFields, [
      { id: "continent", text: "Continent" },
      { id: "browser", text: "Browser" },
    ]);
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <div class="mb-4 flex items-center gap-2">
      <span>Group by:</span>
      <LookupField
        records={m.grouping}
        options={m.groupableFields}
        multiple
        style="width: 300px"
      />
    </div>
    <Grid
      records={m.records}
      style="height: 500px"
      scrollable
      groupingParams={m.grouping}
      fixedFooter
      onGetGrouping={(groupingParams: GroupOption[]) => [
        { key: {}, showFooter: true },
        ...(groupingParams || []).map((x) => x.id),
      ]}
      columns={[
        {
          header: "Name",
          field: "fullName",
          aggregate: "count",
          footer: tpl(m.$group.fullName, "{0} people"),
        },
        {
          header: "Continent",
          field: "continent",
          aggregate: "distinct",
          aggregateAlias: "continents",
          footer: tpl(m.$group.continents, "{0} continents"),
        },
        {
          header: "Browser",
          field: "browser",
          aggregate: "distinct",
          aggregateAlias: "browsers",
          footer: tpl(m.$group.browsers, "{0} browsers"),
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
  </div>
);
// @index-end
