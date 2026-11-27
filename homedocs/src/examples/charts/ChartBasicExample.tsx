import { Svg, Rectangle } from "cx/svg";
import { Chart, NumericAxis, Gridlines } from "cx/charts";

// @index
export default (
  <Svg style="width: 300px; height: 200px; border: 1px solid var(--cx-theme-border-color)">
    <Chart
      margin="10 20 30 50"
      axes={{
        x: { type: NumericAxis },
        y: { type: NumericAxis, vertical: true },
      }}
    >
      <Rectangle style="fill: var(--cx-theme-background-color); stroke: var(--cx-theme-border-color)" />
      <Gridlines />
    </Chart>
  </Svg>
);
// @index-end
