import { Svg } from "cx/svg";
import {
  Chart,
  NumericAxis,
  CategoryAxis,
  Swimlanes,
  BarGraph,
  Legend,
} from "cx/charts";
import { createModel } from "cx/data";
import { Controller, KeySelection } from "cx/ui";

// @model
interface DataPoint {
  city: string;
  v1: number;
  v2: number;
}

interface Model {
  points: DataPoint[];
  selected: string | null;
}

const m = createModel<Model>();
// @model-end

const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
];

// @controller
class PageController extends Controller {
  onInit() {
    let v1 = 100;
    let v2 = 110;
    this.store.set(
      m.points,
      cities.map((city) => ({
        city,
        v1: (v1 = v1 + (Math.random() - 0.5) * 30),
        v2: (v2 = v2 + (Math.random() - 0.5) * 30),
      })),
    );
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController} style="display: flex; gap: 16px">
    <Svg style="flex: 1; height: 400px">
      <Chart
        offset="20 -20 -30 100"
        axes={{
          x: { type: NumericAxis, snapToTicks: 1 },
          y: { type: CategoryAxis, vertical: true },
        }}
      >
        <Swimlanes size={0.6} step={1} />
        <BarGraph
          data={m.points}
          colorIndex={0}
          name="2023"
          size={0.3}
          offset={-0.15}
          xField="v1"
          yField="city"
          selection={{
            type: KeySelection,
            bind: m.selected,
            keyField: "city",
          }}
        />
        <BarGraph
          data={m.points}
          colorIndex={6}
          name="2024"
          size={0.3}
          offset={0.15}
          xField="v2"
          yField="city"
          selection={{
            type: KeySelection,
            bind: m.selected,
            keyField: "city",
          }}
        />
      </Chart>
    </Svg>
    <Legend vertical />
  </div>
);
// @index-end
