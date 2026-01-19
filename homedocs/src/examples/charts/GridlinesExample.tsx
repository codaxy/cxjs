/** @jsxImportSource cx */
import { Svg, Rectangle } from "cx/svg";
import { Chart, NumericAxis, Gridlines } from "cx/charts";

export default () => (
  <cx>
    <Svg style="width: 100%; height: 200px;">
      <Chart
        margin="20 20 40 50"
        axes={{
          x: { type: NumericAxis },
          y: { type: NumericAxis, vertical: true },
        }}
      >
        <Rectangle fill="white" />
        <Gridlines />
      </Chart>
    </Svg>
  </cx>
);
