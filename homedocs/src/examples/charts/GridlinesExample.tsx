import { Svg, Rectangle } from "cx/svg";
import { Chart, NumericAxis, Gridlines } from "cx/charts";

// @index
export default (
  <Svg style="width: 400px; height: 300px; border: 1px dashed var(--cx-theme-border-color)">
    <Chart
      margin="40 20 40 50"
      axes={{
        x: <NumericAxis />,
        y: <NumericAxis vertical />,
      }}
    >
      <Rectangle style="fill: var(--cx-theme-background-color)" />
      <Gridlines />
    </Chart>
  </Svg>
);
// @index-end
