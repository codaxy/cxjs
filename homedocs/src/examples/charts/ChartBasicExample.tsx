/** @jsxImportSource cx */
import { Svg } from "cx/svg";
import { Chart, NumericAxis, Gridlines } from "cx/charts";

export default () => (
  <cx>
    <Svg style="width:300px;height:200px">
      <Chart
        margin="10 20 30 50"
        axes={{
          x: { type: NumericAxis },
          y: { type: NumericAxis, vertical: true },
        }}
      >
        <Gridlines />
      </Chart>
    </Svg>
  </cx>
);
