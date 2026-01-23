import { Svg, Rectangle } from "cx/svg";
import {
  Chart,
  NumericAxis,
  CategoryAxis,
  Gridlines,
  BarGraph,
  Legend,
} from "cx/charts";
import { createModel } from "cx/data";
import { Controller, ContentPlaceholderScope, expr } from "cx/ui";
import { ContentPlaceholder } from "cx/widgets";

// @model
interface Point {
  city: string;
  v1: number;
  v2: number;
}

interface Model {
  data: Point[];
  v1Active: boolean;
  v2Active: boolean;
}

const m = createModel<Model>();
// @model-end

const cities = [
  "Tokyo",
  "Delhi",
  "Shanghai",
  "São Paulo",
  "Mexico City",
  "Cairo",
  "Mumbai",
  "Beijing",
  "Dhaka",
  "Osaka",
  "New York",
  "Karachi",
  "Buenos Aires",
  "Istanbul",
  "Kolkata",
  "Lagos",
  "Manila",
  "Tianjin",
  "Rio de Janeiro",
  "Guangzhou",
  "Lahore",
  "Bangalore",
  "Moscow",
  "Shenzhen",
  "Chennai",
  "Jakarta",
  "Lima",
  "Bangkok",
  "Seoul",
  "Nagoya",
  "London",
  "Paris",
  "Tehran",
  "Ho Chi Minh",
];

// @controller
class PageController extends Controller {
  onInit() {
    let v1 = 150,
      v2 = 200;
    this.store.set(
      m.data,
      cities
        .map((city) => ({
          city,
          v1: (v1 = v1 + (Math.random() - 0.5) * 30),
          v2: (v2 = v2 + (Math.random() - 0.5) * 30),
        }))
        .sort((a, b) => a.v2 - b.v2),
    );
    this.store.set(m.v1Active, true);
    this.store.set(m.v2Active, true);
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <Legend />
    <ContentPlaceholderScope name="xAxis">
      <div style="border: 1px dashed #ddd">
        <div style="overflow-y: auto; max-height: 400px; margin-top: 16px">
          <Svg
            style={{
              width: "100%",
              height: expr(m.data, (data) => (data?.length ?? 0) * 25),
            }}
          >
            <Chart
              offset="1 -20 0 120"
              axes={{
                x: (
                  <NumericAxis
                    snapToTicks={1}
                    putInto="xAxis"
                    anchors="0 1 0 0"
                    offset="-1 0 0 0"
                  />
                ),
                y: <CategoryAxis vertical />,
              }}
            >
              <Rectangle fill="white" />
              <Gridlines />
              <BarGraph
                name="2023"
                data={m.data}
                colorIndex={0}
                size={0.3}
                offset={-0.15}
                xField="v1"
                yField="city"
                active={m.v1Active}
              />
              <BarGraph
                name="2024"
                data={m.data}
                colorIndex={5}
                size={0.3}
                offset={0.15}
                xField="v2"
                yField="city"
                active={m.v2Active}
              />
            </Chart>
          </Svg>
        </div>
        <Svg style="height: 40px; width: 100%; margin-top: -1px">
          <ContentPlaceholder name="xAxis" />
        </Svg>
      </div>
    </ContentPlaceholderScope>
  </div>
);
// @index-end
