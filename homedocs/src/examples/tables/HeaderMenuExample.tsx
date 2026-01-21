import { createModel } from "cx/data";
import { Controller, Repeater, bind } from "cx/ui";
import { Checkbox, Grid, Icon, Menu, Submenu, TextField } from "cx/widgets";

// @model
interface Person {
  id: number;
  fullName: string;
  continent: string;
  browser: string;
  visits: number;
}

interface FilterOption {
  name: string;
  active: boolean;
}

interface PageModel {
  records: Person[];
  filtered: Person[];
  filter: {
    name: string;
    continents: FilterOption[];
    browsers: FilterOption[];
  };
  visibility: {
    continent: boolean;
    browser: boolean;
    visits: boolean;
  };
  $record: Person;
  $option: FilterOption;
}

const m = createModel<PageModel>();
// @model-end

// @util
function unique(data: Person[], field: keyof Person): FilterOption[] {
  let values: Record<string, boolean> = {};
  data.forEach((item) => {
    values[String(item[field])] = true;
  });
  return Object.keys(values).map((name) => ({ name, active: true }));
}

function filterRecords(
  filter: PageModel["filter"],
  records: Person[],
): Person[] {
  return records.filter((record) => {
    let continent = filter.continents.find(
      (c) => c.name === record.continent,
    )?.active;
    let browser = filter.browsers.find(
      (b) => b.name === record.browser,
    )?.active;
    let name = filter.name
      ? record.fullName.toLowerCase().includes(filter.name.toLowerCase())
      : true;
    return continent && browser && name;
  });
}
// @util-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.init(m.visibility, {
      continent: true,
      browser: true,
      visits: true,
    });

    let records: Person[] = [
      {
        id: 1,
        fullName: "Alice Johnson",
        continent: "Europe",
        browser: "Chrome",
        visits: 45,
      },
      {
        id: 2,
        fullName: "Bob Smith",
        continent: "Asia",
        browser: "Firefox",
        visits: 23,
      },
      {
        id: 3,
        fullName: "Carol White",
        continent: "North America",
        browser: "Safari",
        visits: 67,
      },
      {
        id: 4,
        fullName: "David Brown",
        continent: "Europe",
        browser: "Chrome",
        visits: 12,
      },
      {
        id: 5,
        fullName: "Eva Green",
        continent: "Asia",
        browser: "Edge",
        visits: 89,
      },
    ];

    this.store.set(m.records, records);
    this.store.set(m.filter.continents, unique(records, "continent"));
    this.store.set(m.filter.browsers, unique(records, "browser"));
    this.store.set(m.filter.name, "");

    this.addTrigger(
      "filter",
      [m.filter],
      (filter) => {
        this.store.set(m.filtered, filterRecords(filter, records));
      },
      true,
    );
  }
}

const visibleColumnsMenu = (
  <Submenu arrow>
    Columns
    <Menu putInto="dropdown">
      <Checkbox value={m.visibility.continent} mod="menu">
        Continent
      </Checkbox>
      <Checkbox value={m.visibility.browser} mod="menu">
        Browser
      </Checkbox>
      <Checkbox value={m.visibility.visits} mod="menu">
        Visits
      </Checkbox>
    </Menu>
  </Submenu>
);

const columnMenu = (filter: any) => (
  <Menu horizontal itemPadding="none">
    <Submenu placement="down-left" class="mr-1 mt-2">
      <Icon name="menu" />
      <Menu putInto="dropdown">
        {filter}
        <hr />
        {visibleColumnsMenu}
      </Menu>
    </Submenu>
  </Menu>
);

const checkboxFilterMenu = (valuesPath: string) =>
  columnMenu(
    <Repeater records={bind(valuesPath)} recordAlias={m.$option}>
      <Checkbox mod="menu" value={m.$option.active} text={m.$option.name} />
    </Repeater>,
  );
// @controller-end

// @index
export default () => (
  <Grid
    controller={PageController}
    records={m.filtered}
    style="height: 300px;"
    scrollable
    border
    emptyText="No records found matching the given criteria."
    columns={[
      {
        header: {
          text: "Name",
          tool: columnMenu(
            <TextField mod="menu" placeholder="Filter" value={m.filter.name} />,
          ),
        },
        field: "fullName",
        sortable: true,
      },
      {
        header: {
          text: "Continent",
          tool: checkboxFilterMenu("filter.continents"),
        },
        field: "continent",
        visible: m.visibility.continent,
        sortable: true,
      },
      {
        header: {
          text: "Browser",
          tool: checkboxFilterMenu("filter.browsers"),
        },
        field: "browser",
        visible: m.visibility.browser,
        sortable: true,
      },
      {
        header: "Visits",
        field: "visits",
        align: "right",
        visible: m.visibility.visits,
        sortable: true,
      },
    ]}
  />
);
// @index-end
