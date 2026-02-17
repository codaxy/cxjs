import { Svg, Rectangle } from "cx/svg";

// @index
export default (
  <Svg style="width: 300px; height: 200px; border: 1px solid #ddd">
    <Rectangle fill="#f0f0f0" />
    <rect x={20} y={20} width={80} height={60} fill="lightblue" stroke="steelblue" />
    <ellipse cx={180} cy={50} rx={40} ry={30} fill="lightgreen" stroke="green" />
    <line x1={20} y1={120} x2={280} y2={120} stroke="#999" />
    <line x1={20} y1={140} x2={280} y2={180} stroke="coral" stroke-width={2} />
    <text x={150} y={170} text-anchor="middle" style="font-size: 14px">
      SVG Elements
    </text>
  </Svg>
);
// @index-end
