/** @jsxImportSource cx */
import { Svg, Rectangle } from "cx/svg";
import { Chart, NumericAxis, Gridlines } from "cx/charts";

export default () => (
  <cx>
    <Svg style="width: 100%; height: 250px;">
      <Chart
        margin="50 50 50 50"
        axes={{
          x: { type: NumericAxis, min: 0, max: 100 },
          y: { type: NumericAxis, vertical: true, min: 0, max: 500 },
        }}
      >
        <Rectangle fill="white" />
        <Gridlines />
      </Chart>
    </Svg>
  </cx>
);
