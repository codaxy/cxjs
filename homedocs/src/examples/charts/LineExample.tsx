import { Svg, Line, Text } from "cx/svg";

// @index
export default () => (
  <Svg style="height: 200px; border: 1px dashed #ddd">
    <Line stroke="steelblue" style="stroke-width: 2">
      <Text dy="0.4em" textAnchor="middle">
        Diagonal Line
      </Text>
    </Line>
  </Svg>
);
// @index-end
