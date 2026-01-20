import { Svg, Rectangle } from "cx/svg";
import { Chart, CategoryAxis, NumericAxis, Gridlines, Bar } from "cx/charts";
import { createModel } from "cx/data";
import { Controller, Text, computable } from "cx/ui";
import { Slider, Repeater } from "cx/widgets";

// @model
interface Point {
  name: string;
  count: number;
}

interface Model {
  itemCount: number;
  categoryCount: number;
  points: Point[];
}

const m = createModel<Model>();
// @model-end

const categories = [
  "Europe",
  "Asia",
  "Africa",
  "America",
  "Australia",
  "Antarctica",
];

// @controller
class PageController extends Controller<typeof m> {
  onInit() {
    this.store.init(m.itemCount, 5);
    this.addComputable(m.points, [m.itemCount], (itemCount) => {
      let names: Record<string, number> = {};
      for (let i = 0; i < itemCount; i++) {
        let name = categories[Math.floor(Math.random() * categories.length)];
        names[name] = 1 + (names[name] ?? 0);
      }
      return Object.keys(names).map((name) => ({ name, count: names[name] }));
    });
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController}>
    <Slider
      value={{ bind: m.itemCount.toString(), debounce: 100 }}
      minValue={1}
      maxValue={50}
      step={1}
      style="width: 200px; margin-bottom: 16px"
      help={<Text value={m.itemCount} />}
    />
    <Svg
      style={{
        width: "500px",
        height: computable(m.categoryCount, (count) => (count ?? 1) * 40 + 60),
        border: "1px dashed #ddd",
      }}
    >
      <Chart
        margin="20 20 40 100"
        axes={{
          y: <CategoryAxis vertical inverted categoryCount={m.categoryCount} />,
          x: <NumericAxis minLabelTickSize={1} />,
        }}
      >
        <Rectangle fill="white" />
        <Gridlines />
        <Repeater
          records={m.points}
          recordAlias="$point"
          sortField="count"
          sortDirection="DESC"
        >
          <Bar
            colorIndex={6}
            x={{ bind: "$point.count" }}
            y={{ bind: "$point.name" }}
            size={0.5}
          />
        </Repeater>
      </Chart>
    </Svg>
  </div>
);
// @index-end
