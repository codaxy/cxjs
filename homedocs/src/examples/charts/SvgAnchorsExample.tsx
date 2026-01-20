import { Svg, Rectangle, Text } from "cx/svg";

// @index
export default () => (
  <div class="flex flex-wrap gap-2">
    <Svg style="width: 100px; height: 100px; background: white; border: 1px dotted #ccc">
      <Rectangle anchors="0 1 1 0" style="fill: lightblue" />
      <Text textAnchor="middle" dy="0.4em" style="font-size: 10px">
        0 1 1 0
      </Text>
    </Svg>

    <Svg style="width: 100px; height: 100px; background: white; border: 1px dotted #ccc">
      <Rectangle anchors="0.25 0.75 0.75 0.25" style="fill: lightblue" />
      <Text textAnchor="middle" dy="0.4em" style="font-size: 10px">
        0.25 0.75 0.75 0.25
      </Text>
    </Svg>

    <Svg style="width: 100px; height: 100px; background: white; border: 1px dotted #ccc">
      <Rectangle anchors="0 0.5 1 0" style="fill: lightblue" />
      <Text textAnchor="middle" dy="0.4em" style="font-size: 10px">
        0 0.5 1 0
      </Text>
    </Svg>

    <Svg style="width: 100px; height: 100px; background: white; border: 1px dotted #ccc">
      <Rectangle anchors="0 1 0.5 0" style="fill: lightblue" />
      <Text textAnchor="middle" dy="0.4em" style="font-size: 10px">
        0 1 0.5 0
      </Text>
    </Svg>

    <Svg style="width: 100px; height: 100px; background: white; border: 1px dotted #ccc">
      <Rectangle anchors="0.5 1 1 0.5" style="fill: lightblue" />
      <Text textAnchor="middle" dy="0.4em" style="font-size: 10px">
        0.5 1 1 0.5
      </Text>
    </Svg>
  </div>
);
// @index-end
