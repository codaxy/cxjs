import { Svg, ClipRect, Ellipse } from "cx/svg";

// @index
export default (
  <Svg style="width: 200px; height: 200px; border: 1px dashed var(--cx-theme-border-color)">
    <ClipRect margin={15}>
      <Ellipse margin={-10} fill="red" />
    </ClipRect>
  </Svg>
);
// @index-end
