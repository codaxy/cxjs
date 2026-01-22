import { Svg, Rectangle } from "cx/svg";
import { Chart, NumericAxis, Gridlines } from "cx/charts";

// @index
export default (
  <Svg style="width: 400px; height: 300px; border: 1px dashed #ddd" margin="60 60 60 60">
    <Chart
      axes={{
        x: <NumericAxis min={100} max={500} />,
        y: <NumericAxis vertical max={5000} />,
        x2: <NumericAxis secondary inverted />,
        y2: <NumericAxis vertical secondary />,
      }}
    >
      <Rectangle fill="white" margin={1} />
      <Gridlines />
      <Gridlines xAxis="x2" yAxis="y2" />
    </Chart>
  </Svg>
);
// @index-end
