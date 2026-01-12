/** @jsxImportSource cx */
import { Svg, Rectangle } from "cx/svg";
import { Chart, CategoryAxis, Gridlines, Marker } from "cx/charts";

export default () => (
  <cx>
    <Svg style="width: 100%; height: 250px;">
      <Chart
        margin="40 40 40 60"
        axes={{
          x: { type: CategoryAxis },
          y: { type: CategoryAxis, vertical: true },
        }}
      >
        <Rectangle fill="white" />
        <Gridlines />
        <Marker x="A" y="Small" shape="circle" size={15} colorIndex={0} />
        <Marker x="B" y="Small" shape="circle" size={15} colorIndex={2} />
        <Marker x="C" y="Small" shape="circle" size={15} colorIndex={4} />
        <Marker x="A" y="Medium" shape="square" size={15} colorIndex={0} />
        <Marker x="B" y="Medium" shape="square" size={15} colorIndex={2} />
        <Marker x="C" y="Medium" shape="square" size={15} colorIndex={4} />
        <Marker x="A" y="Large" shape="triangle" size={15} colorIndex={0} />
        <Marker x="B" y="Large" shape="triangle" size={15} colorIndex={2} />
        <Marker x="C" y="Large" shape="triangle" size={15} colorIndex={4} />
      </Chart>
    </Svg>
  </cx>
);
