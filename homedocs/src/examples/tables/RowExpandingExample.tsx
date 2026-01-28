import { createModel } from "cx/data";
import { Controller, expr } from "cx/ui";
import { Button, Grid } from "cx/widgets";

// @model
interface Person {
  id: number;
  fullName: string;
  continent: string;
  browser: string;
  visits: number;
  expanded?: boolean;
  bio: string;
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
        continent: "Europe",
        browser: "Chrome",
        visits: 45,
        bio: "Software engineer with 10 years of experience in web development.",
      },
      {
        id: 2,
        fullName: "Bob Smith",
        continent: "Asia",
        browser: "Firefox",
        visits: 23,
        bio: "Product manager focusing on user experience and growth.",
      },
      {
        id: 3,
        fullName: "Carol White",
        continent: "North America",
        browser: "Safari",
        visits: 67,
        bio: "Data scientist specializing in machine learning and analytics.",
      },
      {
        id: 4,
        fullName: "David Brown",
        continent: "Europe",
        browser: "Chrome",
        visits: 12,
        bio: "UX designer passionate about creating intuitive interfaces.",
      },
      {
        id: 5,
        fullName: "Eva Green",
        continent: "Asia",
        browser: "Edge",
        visits: 89,
        bio: "Full-stack developer with expertise in React and Node.js.",
      },
    ]);
  }
}
// @controller-end

// @index
export default (
  <Grid
    controller={PageController}
    records={m.records}
    style="width: 100%"
    border
    lockColumnWidths
    row={{
      style: {
        background: expr(m.$record.expanded, (expanded) =>
          expanded ? "#fff7e6" : null,
        ),
      },
      line1: {
        columns: [
          { header: "Name", field: "fullName", sortable: true },
          { header: "Continent", field: "continent", sortable: true },
          { header: "Browser", field: "browser", sortable: true },
          { header: "Visits", field: "visits", sortable: true, align: "right" },
          {
            align: "center",
            pad: false,
            items: (
              <Button
                mod="hollow"
                icon="drop-down"
                onClick={(e, { store }) => {
                  store.toggle(m.$record.expanded);
                }}
              />
            ),
          },
        ],
      },
      line2: {
        visible: m.$record.expanded,
        columns: [
          {
            colSpan: 1000,
            style: "border-top-color: rgba(0, 0, 0, 0.05); padding: 16px;",
            items: (
              <div>
                <strong>Bio: </strong>
                <span text={m.$record.bio} />
              </div>
            ),
          },
        ],
      },
    }}
  />
);
// @index-end
