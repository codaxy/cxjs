import { createFunctionalComponent } from "cx/ui";
import { Svg } from "cx/svg";
import { Chart, Gridlines, LineGraph, NumericAxis } from "cx/charts";

// @components
interface LineChartProps {
  data: { x: number; y: number }[];
  chartStyle?: string;
  lineStyle?: string;
  areaStyle?: string;
}

const LineChart = createFunctionalComponent(
  ({ data, chartStyle, lineStyle, areaStyle }: LineChartProps) => (
    <Svg style={chartStyle}>
      <Chart
        offset="20 -20 -40 40"
        axes={{
          x: { type: NumericAxis },
          y: { type: NumericAxis, vertical: true },
        }}
      >
        <Gridlines />
        <LineGraph
          data={data}
          lineStyle={lineStyle}
          area={areaStyle != null}
          areaStyle={areaStyle}
          smooth
          smoothingRatio={0.2}
        />
      </Chart>
    </Svg>
  ),
);
// @components-end

// @index
export default () => (
  <div class="flex flex-col gap-4">
    <LineChart
      chartStyle="height: 200px; background: white; border: 1px solid lightgray"
      lineStyle="stroke: red; stroke-width: 1"
      areaStyle="fill: rgba(255, 0, 0, 0.3)"
      data={Array.from({ length: 50 }, (_, x) => ({
        x,
        y: 75 - 50 * Math.random(),
      }))}
    />
    <LineChart
      chartStyle="height: 200px; background: #1a1a2e; color: gray;"
      lineStyle="stroke: lightgreen; stroke-width: 2"
      data={Array.from({ length: 50 }, (_, x) => ({
        x,
        y: 75 - 50 * Math.random(),
      }))}
    />
    <LineChart
      chartStyle="height: 200px; background: #2e2e4c; color: rgba(255, 255, 255, 0.7);"
      lineStyle="stroke: currentColor; stroke-width: 2"
      data={Array.from({ length: 50 }, (_, x) => ({
        x,
        y: 75 - 50 * Math.random(),
      }))}
    />
  </div>
);
// @index-end
