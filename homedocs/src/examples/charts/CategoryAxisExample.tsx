import { Svg, Rectangle } from "cx/svg";
import { Chart, CategoryAxis, Gridlines, Marker } from "cx/charts";

// @index
export default (
  <Svg style="width: 400px; height: 300px; border: 1px dashed #ddd">
    <Chart
      margin="60 60 60 90"
      axes={{
        x: <CategoryAxis />,
        y: <CategoryAxis vertical />,
      }}
    >
      <Rectangle fill="white" />
      <Gridlines />

      <Marker x="Red" y="Triangle" shape="triangle" size={20} colorIndex={0} />
      <Marker x="Green" y="Triangle" shape="triangle" size={20} colorIndex={9} />
      <Marker x="Blue" y="Triangle" shape="triangle" size={20} colorIndex={5} />

      <Marker x="Red" y="Square" shape="square" size={20} colorIndex={0} />
      <Marker x="Green" y="Square" shape="square" size={20} colorIndex={9} />
      <Marker x="Blue" y="Square" shape="square" size={20} colorIndex={5} />

      <Marker x="Red" y="Circle" shape="circle" size={20} colorIndex={0} />
      <Marker x="Green" y="Circle" shape="circle" size={20} colorIndex={9} />
      <Marker x="Blue" y="Circle" shape="circle" size={20} colorIndex={5} />
    </Chart>
  </Svg>
);
// @index-end
