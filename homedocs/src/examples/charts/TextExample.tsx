import { Svg, Rectangle, Text } from "cx/svg";

// @index
export default (
  <div class="flex flex-wrap gap-2">
    <Svg style="width: 100px; height: 100px; border: 1px dashed #ddd">
      <Rectangle anchors="0 1 1 0" style="fill: lightblue" />
      <Text anchors="0 1 1 0" textAnchor="start" dominantBaseline="hanging">
        Top-left
      </Text>
    </Svg>
    <Svg style="width: 100px; height: 100px; border: 1px dashed #ddd">
      <Rectangle anchors="0 1 1 0.5" style="fill: lightblue" />
      <Text anchors="0 1 1 0.5" textAnchor="middle" dominantBaseline="hanging">
        Top-center
      </Text>
    </Svg>
    <Svg style="width: 100px; height: 100px; border: 1px dashed #ddd">
      <Rectangle anchors="0 1 1 1" style="fill: lightblue" />
      <Text anchors="0 1 1 1" textAnchor="end" dominantBaseline="hanging">
        Top-right
      </Text>
    </Svg>

    <Svg style="width: 100px; height: 100px; border: 1px dashed #ddd">
      <Rectangle anchors="0.5 1 1 0" style="fill: lightblue" />
      <Text anchors="0.5 1 1 0" textAnchor="start" dominantBaseline="middle">
        Middle-left
      </Text>
    </Svg>
    <Svg style="width: 100px; height: 100px; border: 1px dashed #ddd">
      <Rectangle anchors="0.5 1 1 0.5" style="fill: lightblue" />
      <Text anchors="0.5 1 1 0.5" textAnchor="middle" dominantBaseline="middle">
        Center
      </Text>
    </Svg>
    <Svg style="width: 100px; height: 100px; border: 1px dashed #ddd">
      <Rectangle anchors="0.5 1 1 1" style="fill: lightblue" />
      <Text anchors="0.5 1 1 1" textAnchor="end" dominantBaseline="middle">
        Middle-right
      </Text>
    </Svg>

    <Svg style="width: 100px; height: 100px; border: 1px dashed #ddd">
      <Rectangle anchors="1 1 1 0" style="fill: lightblue" />
      <Text anchors="1 1 1 0" textAnchor="start">
        Bottom-left
      </Text>
    </Svg>
    <Svg style="width: 100px; height: 100px; border: 1px dashed #ddd">
      <Rectangle anchors="1 1 1 0.5" style="fill: lightblue" />
      <Text anchors="1 1 1 0.5" textAnchor="middle">
        Bottom-center
      </Text>
    </Svg>
    <Svg style="width: 100px; height: 100px; border: 1px dashed #ddd">
      <Rectangle anchors="1 1 1 1" style="fill: lightblue" />
      <Text anchors="1 1 1 1" textAnchor="end">
        Bottom-right
      </Text>
    </Svg>
  </div>
);
// @index-end
