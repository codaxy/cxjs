import { Svg, Rectangle, Text } from "cx/svg";

// @index
export default () => (
  <div class="flex flex-wrap gap-2">
    <Svg style="width: 100px; height: 100px; background: white; border: 1px dotted #ccc">
      <Rectangle anchors="0 1 1 0" offset="5 -5 -5 5" style="fill: lightblue" />
      <Text textAnchor="middle" dy="-0.1em" style="font-size: 10px">
        A: 0 1 1 0
      </Text>
      <Text textAnchor="middle" dy="0.9em" style="font-size: 10px">
        O: 5 -5 -5 5
      </Text>
    </Svg>

    <Svg style="width: 100px; height: 100px; background: white; border: 1px dotted #ccc">
      <Rectangle anchors="0.5 0.5 0.5 0.5" offset="-30 30 30 -30" style="fill: lightblue" />
      <Text textAnchor="middle" dy="-0.1em" style="font-size: 10px">
        A: 0.5 0.5 0.5 0.5
      </Text>
      <Text textAnchor="middle" dy="0.9em" style="font-size: 10px">
        O: -30 30 30 -30
      </Text>
    </Svg>

    <Svg style="width: 100px; height: 100px; background: white; border: 1px dotted #ccc">
      <Rectangle anchors="0 1 1 0" margin={5} style="fill: lightblue" />
      <Text textAnchor="middle" dy="-0.1em" style="font-size: 10px">
        A: 0 1 1 0
      </Text>
      <Text textAnchor="middle" dy="0.9em" style="font-size: 10px">
        M: 5
      </Text>
    </Svg>

    <Svg style="width: 100px; height: 100px; background: white; border: 1px dotted #ccc">
      <Rectangle anchors="0.5 0.5 0.5 0.5" margin={-30} style="fill: lightblue" />
      <Text textAnchor="middle" dy="-0.1em" style="font-size: 10px">
        A: 0.5 0.5 0.5 0.5
      </Text>
      <Text textAnchor="middle" dy="0.9em" style="font-size: 10px">
        M: -30
      </Text>
    </Svg>
  </div>
);
// @index-end
