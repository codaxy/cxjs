import { Svg } from "cx/svg";
import {
  Chart,
  NumericAxis,
  CategoryAxis,
  Gridlines,
  Bar,
  PieChart,
  PieSlice,
  ColorMap,
  Legend,
  LegendEntry,
} from "cx/charts";
import { createModel } from "cx/data";
import { Repeater, Controller, HoverSync, KeySelection } from "cx/ui";
import { Grid } from "cx/widgets";

// @model
interface DataPoint {
  id: number;
  name: string;
  value: number;
}

interface Model {
  points: DataPoint[];
  $record: DataPoint;
  $index: number;
  selection: number | null;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    let value = 100;
    this.store.set(
      m.points,
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        name: `Item ${i + 1}`,
        value: (value = value + (Math.random() - 0.5) * 30),
      })),
    );
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController}>
    <HoverSync>
      <Legend />
      <Svg style="width: 100%; height: 300px">
          <ColorMap />
          <PieChart anchors="0 0.4 1 0">
            <Repeater
              records={m.points}
              recordAlias="$record"
              indexAlias="$index"
            >
              <PieSlice
                value={m.$record.value}
                colorMap="pie"
                r={80}
                r0={40}
                offset={5}
                hoverId={m.$record.id}
                name={m.$record.name}
                selection={{
                  type: KeySelection,
                  bind: m.selection,
                  records: m.points,
                  record: m.$record,
                  index: m.$index,
                  keyField: "id",
                }}
              />
            </Repeater>
          </PieChart>
          <Chart
            anchors="0 1 1 0.4"
            offset="10 -10 -30 50"
            axes={{
              x: { type: NumericAxis, snapToTicks: 0 },
              y: { type: CategoryAxis, vertical: true, inverted: true },
            }}
          >
            <Gridlines />
            <Repeater
              records={m.points}
              recordAlias="$record"
              indexAlias="$index"
            >
              <Bar
                name={m.$record.name}
                x={m.$record.value}
                y={m.$record.name}
                colorMap="pie"
                hoverId={m.$record.id}
                size={0.5}
                selection={{
                  type: KeySelection,
                  bind: m.selection,
                  records: m.points,
                  record: m.$record,
                  index: m.$index,
                  keyField: "id",
                }}
              />
            </Repeater>
          </Chart>
      </Svg>
      <Grid
        records={m.points}
        style="margin-top: 16px"
          columns={[
            {
              field: "name",
              pad: false,
              header: "Item",
              items: (
                <div class="flex items-center">
                  <LegendEntry
                    name={m.$record.name}
                    colorMap="pie"
                    selection={{
                      type: KeySelection,
                      bind: m.selection,
                      records: m.points,
                      record: m.$record,
                      index: m.$index,
                      keyField: "id",
                    }}
                    size={10}
                    shape="circle"
                  />
                  <span text={m.$record.name} />
                </div>
              ),
            },
            {
              field: "value",
              header: "Value",
              format: "n;1",
              align: "right",
            },
          ]}
          selection={{
            type: KeySelection,
            bind: m.selection,
            keyField: "id",
          }}
          rowHoverId={m.$record.id}
      />
    </HoverSync>
  </div>
);
// @index-end
