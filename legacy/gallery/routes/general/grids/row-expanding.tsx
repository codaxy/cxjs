import {
  Grid,
  HtmlElement,
  Button,
  TextField,
  NumberField,
  Content,
  Section,
} from "cx/widgets";
import { Controller, createModel, expr } from "cx/ui";
import { Svg } from "cx/svg";
import { Chart, Gridlines, LineGraph, NumericAxis } from "cx/charts";
import casual from "../../../util/casual";

const m = createModel<{
  $page: {
    records: Array<{
      fullName: string;
      continent: string;
      browser: string;
      os: string;
      visits: number;
      points: Array<{ x: number; y: number }>;
      showDescription?: boolean;
    }>;
    showGridFilter?: boolean;
    filter: {
      fullName?: string;
      continent?: string;
      browser?: string;
      os?: string;
      visits?: number;
    };
  };
  $record: {
    fullName: string;
    continent: string;
    browser: string;
    os: string;
    visits: number;
    points: Array<{ x: number; y: number }>;
    showDescription?: boolean;
  };
  $root: {
    $route: {
      theme: string;
    };
  };
}>();

class PageController extends Controller {
  onInit() {
    //init grid data
    if (!this.store.get(m.$page.records)) this.shuffle();
  }

  shuffle() {
    this.store.set(
      m.$page.records,
      Array.from({ length: 20 }).map((v, i) => ({
        fullName: casual.full_name,
        continent: casual.continent,
        browser: casual.browser,
        os: casual.operating_system,
        visits: casual.integer(1, 100),
        points: this.generateTrend(),
      })),
    );
  }

  generateTrend() {
    let y = 100;
    return Array.from({ length: 101 }, (_, i) => ({
      x: i * 4,
      y: (y = y + Math.random() - 0.5),
    }));
  }
}

export default (
  <cx>
    <Section
      mod="card"
      controller={PageController}
      style="height: 100%"
      bodyStyle="display:flex; flex-direction:column"
    >
      <Grid
        records={m.$page.records}
        lockColumnWidths
        cached
        style="width: 100%; flex: 1 1 0px"
        scrollable
        row={{
          style: {
            background: expr(
              m.$record.showDescription,
              m.$root.$route.theme,
              (showDesc, theme) =>
                showDesc && theme !== "material-dark" && theme !== "space-blue"
                  ? "#fff7e6"
                  : null
            ),
          },
          line1: {
            columns: [
              {
                header: "Name",
                field: "fullName",
                sortable: true,
              },
              {
                header: "Continent",
                field: "continent",
                sortable: true,
              },
              {
                header: "Browser",
                field: "browser",
                sortable: true,
              },
              {
                header: "OS",
                field: "os",
                sortable: true,
              },
              {
                header: "Visits",
                field: "visits",
                sortable: true,
                align: "right",
              },
              {
                header: {
                  items: (
                    <cx>
                      <cx>
                        <Button
                          mod="hollow"
                          icon="search"
                          onClick={(e, { store }) => {
                            store.toggle(m.$page.showGridFilter);
                          }}
                        />
                      </cx>
                    </cx>
                  ),
                },
                align: "center",
                items: (
                  <cx>
                    <cx>
                      <Button
                        mod="hollow"
                        icon="drop-down"
                        onClick={(e, { store }) => {
                          store.toggle(m.$record.showDescription);
                        }}
                      />
                    </cx>
                  </cx>
                ),
              },
            ],
          },
          line2: {
            showHeader: expr(m.$page.showGridFilter, (v) => !!v),
            visible: false,
            columns: [
              {
                header: {
                  items: (
                    <cx>
                      <TextField
                        value={m.$page.filter.fullName}
                        style="width: 100%"
                        autoFocus
                      />
                    </cx>
                  ),
                },
              },
              {
                header: {
                  items: (
                    <cx>
                      <TextField
                        value={m.$page.filter.continent}
                        style="width: 100%"
                      />
                    </cx>
                  ),
                },
              },
              {
                header: {
                  items: (
                    <cx>
                      <TextField
                        value={m.$page.filter.browser}
                        style="width: 100%"
                      />
                    </cx>
                  ),
                },
              },
              {
                header: {
                  items: (
                    <cx>
                      <TextField
                        value={m.$page.filter.os}
                        style="width: 100%"
                      />
                    </cx>
                  ),
                },
              },
              {
                header: {
                  items: (
                    <cx>
                      <NumberField
                        value={m.$page.filter.visits}
                        style="width: 100%"
                        inputStyle="text-align: right"
                      />
                    </cx>
                  ),
                },
              },
              {
                header: {
                  align: "center",
                  items: (
                    <cx>
                      <Button
                        mod="hollow"
                        icon="close"
                        onClick={(e, { store }) => {
                          store.toggle(m.$page.showGridFilter);
                        }}
                      />
                    </cx>
                  ),
                },
              },
            ],
          },
          line3: {
            visible: m.$record.showDescription,
            columns: [
              {
                colSpan: 1000,
                style: "border-top-color: rgba(0, 0, 0, 0.05)",
                items: (
                  <cx>
                    <Svg style="width:100%px; height:400px;">
                      <Chart
                        offset="20 -10 -40 40"
                        axes={{
                          x: { type: NumericAxis },
                          y: { type: NumericAxis, vertical: true },
                        }}
                      >
                        <Gridlines />
                        <LineGraph data={m.$record.points} colorIndex={8} />
                      </Chart>
                    </Svg>
                  </cx>
                ),
              },
            ],
          },
        }}
      />
    </Section>
  </cx>
);
