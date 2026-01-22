import { Svg, Rectangle } from "cx/svg";
import { Chart, NumericAxis, Gridlines } from "cx/charts";

// @index
export default (
  <Svg style="width: 400px; height: 300px; border: 1px solid #ddd">
    <Chart
      margin="60 60 60 60"
      axes={{
        x: { type: NumericAxis, min: 100, max: 500 },
        y: { type: NumericAxis, vertical: true, max: 5000 },
        x2: { type: NumericAxis, secondary: true, inverted: true },
        y2: { type: NumericAxis, vertical: true, secondary: true },
      }}
    >
      <Rectangle fill="white" margin={1} />
      <Gridlines />
      <Gridlines xAxis="x2" yAxis="y2" />
    </Chart>
  </Svg>
);
// @index-end
