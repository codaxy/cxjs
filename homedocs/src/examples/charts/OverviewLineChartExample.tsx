import { Svg, Rectangle } from "cx/svg";
import { Chart, Gridlines, Legend, LineGraph, NumericAxis } from "cx/charts";

// @index
export default (
  <div>
    <Legend.Scope>
      <Svg style="height: 200px;">
        <Chart
          margin="10 20 30 50"
          axes={{
            x: { type: NumericAxis },
            y: { type: NumericAxis, vertical: true },
          }}
        >
          <Gridlines />
          <LineGraph
            name="Line 1"
            colorIndex={5}
            data={[
              { x: 0, y: 0 },
              { x: 100, y: 100 },
              { x: 200, y: 150 },
            ]}
          />
          <LineGraph
            name="Line 2"
            colorIndex={10}
            data={[
              { x: 0, y: 50 },
              { x: 100, y: 150 },
              { x: 200, y: 100 },
            ]}
          />
        </Chart>
      </Svg>
      <Legend class="mt-4" />
    </Legend.Scope>
  </div>
);
// @index-end
