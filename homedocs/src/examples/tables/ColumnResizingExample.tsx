import { createModel } from "cx/data";
import { Controller } from "cx/ui";
import { Button, Grid, GridInstance } from "cx/widgets";

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
  colWidth: {
    fullName?: number;
    continent?: number;
    browser?: number;
    os?: number;
    visits?: number;
  };
  $record: Person;
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller {
  gridInstance?: GridInstance;

  onInit() {
    this.store.set(m.records, [
      {
        id: 1,
        fullName: "Alice Johnson",
        continent: "Europe",
        browser: "Chrome",
        os: "Windows",
        visits: 45,
      },
      {
        id: 2,
        fullName: "Bob Smith",
        continent: "Asia",
        browser: "Firefox",
        os: "macOS",
        visits: 23,
      },
      {
        id: 3,
        fullName: "Carol White",
        continent: "North America",
        browser: "Safari",
        os: "macOS",
        visits: 67,
      },
      {
        id: 4,
        fullName: "David Brown",
        continent: "Europe",
        browser: "Chrome",
        os: "Linux",
        visits: 12,
      },
      {
        id: 5,
        fullName: "Eva Green",
        continent: "Asia",
        browser: "Edge",
        os: "Windows",
        visits: 89,
      },
    ]);
  }

  resetColumnWidths() {
    this.gridInstance?.resetColumnWidths();
    this.store.delete(m.colWidth);
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <Grid
      records={m.records}
      style="height: 250px; margin-bottom: 10px"
      scrollable
      border
      onRef={(el, instance) => {
        instance.getControllerByType(PageController).gridInstance = instance;
      }}
      columns={[
        {
          header: {
            text: "Name",
            width: m.colWidth.fullName,
            resizable: true,
            defaultWidth: 200,
          },
          field: "fullName",
          sortable: true,
        },
        {
          header: "Continent",
          width: m.colWidth.continent,
          resizable: true,
          field: "continent",
          sortable: true,
        },
        {
          header: "Browser",
          width: m.colWidth.browser,
          resizable: true,
          field: "browser",
          sortable: true,
        },
        {
          header: "OS",
          width: m.colWidth.os,
          resizable: true,
          field: "os",
          sortable: true,
        },
        {
          header: "Visits",
          width: m.colWidth.visits,
          resizable: false,
          field: "visits",
          sortable: true,
          align: "right",
        },
      ]}
    />
    <Button
      text="Reset column widths"
      onClick={(e, instance) => {
        instance.getControllerByType(PageController).resetColumnWidths();
      }}
    />
  </div>
);
// @index-end
