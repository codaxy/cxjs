import { Svg, Rectangle } from "cx/svg";
import { Chart, NumericAxis, CategoryAxis, Gridlines, Bar } from "cx/charts";
import { createModel } from "cx/data";
import { Controller, Repeater, KeySelection, format, Sorter } from "cx/ui";
import { enableTooltips, Grid } from "cx/widgets";

enableTooltips();

// @model
interface Point {
  id: number;
  city: string;
  y2022: number;
  y2023: number;
  y2024: number;
}

interface Model {
  data: Point[];
  $point: Point;
  $index: number;
  selection: number | null;
  sorters: Sorter[];
}

const m = createModel<Model>();
// @model-end

const cities = [
  "Tokyo",
  "New York",
  "London",
  "Paris",
  "Sydney",
  "Berlin",
  "Toronto",
];

// @controller
class PageController extends Controller<typeof m> {
  onInit() {
    let v = 100;
    this.store.set(
      m.data,
      cities.map((city, i) => ({
        id: i,
        city,
        y2022: (v = v + (Math.random() - 0.5) * 30),
        y2023: v + 50 + Math.random() * 100,
        y2024: v + 50 + Math.random() * 100,
      })),
    );
  }
}
// @controller-end

const barSelection = new KeySelection({
  keyField: "id",
  bind: "selection",
  record: m.$point,
  index: m.$index,
});

const legendStyle =
  "border: 1px solid; display: inline-block; width: 20px; height: 10px";

// @index
export default (
  <div
    controller={PageController}
    style="display: flex; flex-wrap: wrap; gap: 16px"
  >
    <Svg style="height: 350px; flex: 1; min-width: 400px">
      <Chart
        offset="20 -20 -40 120"
        axes={{
          x: <NumericAxis snapToTicks={1} />,
          y: <CategoryAxis vertical inverted />,
        }}
      >
        <Rectangle fill="white" />
        <Gridlines />
        <Repeater records={m.data} recordAlias="$point" sorters={m.sorters}>
          <Bar
            colorIndex={0}
            height={0.2}
            offset={-0.2}
            x={m.$point.y2022}
            y={m.$point.city}
            selection={barSelection}
            tooltip={format(m.$point.y2022, "n;0")}
          />
          <Bar
            colorIndex={2}
            height={0.2}
            offset={0}
            x={m.$point.y2023}
            y={m.$point.city}
            selection={barSelection}
            tooltip={format(m.$point.y2023, "n;0")}
          />
          <Bar
            colorIndex={4}
            height={0.2}
            offset={0.2}
            x={m.$point.y2024}
            y={m.$point.city}
            selection={barSelection}
            tooltip={format(m.$point.y2024, "n;0")}
          />
        </Repeater>
      </Chart>
    </Svg>
    <Grid
      style="flex: 1; min-width: 350px"
      records={m.data}
      sorters={m.sorters}
      columns={[
        { header: "City", field: "city", sortable: true },
        {
          field: "y2022",
          format: "n;0",
          align: "right",
          sortable: true,
          header: {
            items: (
                              <div preserveWhitespace>
                  2022 <div className="cxs-color-0" style={legendStyle} />
                </div>
                          ),
          },
        },
        {
          field: "y2023",
          format: "n;0",
          align: "right",
          sortable: true,
          header: {
            items: (
                              <div preserveWhitespace>
                  2023 <div className="cxs-color-2" style={legendStyle} />
                </div>
                          ),
          },
        },
        {
          field: "y2024",
          format: "n;0",
          align: "right",
          sortable: true,
          header: {
            items: (
                              <div preserveWhitespace>
                  2024 <div className="cxs-color-4" style={legendStyle} />
                </div>
                          ),
          },
        },
      ]}
      selection={{ type: KeySelection, keyField: "id", bind: "selection" }}
    />
  </div>
);
// @index-end
