import { Svg, Rectangle } from "cx/svg";
import { Chart, NumericAxis, Gridlines } from "cx/charts";

// @index
export default (
  <Svg style="width: 400px; height: 300px; border: 1px dashed #ddd">
    <Chart
      margin="40 20 40 50"
      axes={{
        x: <NumericAxis />,
        y: <NumericAxis vertical />,
      }}
    >
      <Rectangle fill="white" />
      <Gridlines />
    </Chart>
  </Svg>
);
// @index-end
