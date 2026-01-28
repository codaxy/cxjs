import { Svg, Text, Line, Rectangle } from "cx/svg";
import {
  PieChart,
  PieSlice,
  PieLabelsContainer,
  PieLabel,
  ColorMap,
  Legend,
} from "cx/charts";
import { createModel } from "cx/data";
import { Controller, Repeater, LabelsTopLayout, falsy, tpl } from "cx/ui";
import { Slider, Switch } from "cx/widgets";

// @model
interface Slice {
  id: number;
  name: string;
  value: number;
  active: boolean;
}

interface Model {
  data: Slice[];
  $record: Slice;
  count: number;
  distance: number;
  autoAlign: boolean;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.count, 10);
    this.store.set(m.distance, 60);
    this.store.set(m.autoAlign, true);

    this.addTrigger(
      "points",
      [m.count],
      (count) => {
        this.store.set(
          m.data,
          Array.from({ length: count }, (_, i) => ({
            id: i,
            name: "Item " + (i + 1),
            value: Math.random() * 30,
            active: true,
          })),
        );
      },
      true,
    );
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <Legend />
    <Svg style="width: 100%; height: 400px">
      <ColorMap />
      <PieLabelsContainer>
        <PieChart margin="0 80 0 80" gap={2}>
          <Repeater records={m.data}>
            <PieSlice
              value={m.$record.value}
              active={m.$record.active}
              colorMap="pie"
              r={60}
              r0={20}
              borderRadius={3}
              innerPointRadius={60}
              outerPointRadius={70}
              name={m.$record.name}
            >
              <Line style="stroke: gray" />
              <PieLabel
                anchors="1 1 1 1"
                offset="-12 60 12 -60"
                distance={m.distance}
                lineStroke="gray"
              >
                <Rectangle
                  style="stroke: rgba(0, 0, 0, 0.1); fill: none"
                  visible={falsy(m.autoAlign)}
                />
                <Text
                  visible={falsy(m.autoAlign)}
                  value={tpl(m.$record.name, m.$record.value, "{0} ({1:n;1})")}
                  dominantBaseline="middle"
                  textAnchor="middle"
                />
                <Text
                  visible={m.autoAlign}
                  value={tpl(m.$record.name, m.$record.value, "{0} ({1:n;1})")}
                  dominantBaseline="middle"
                  autoTextAnchor
                  anchors="0.5 1 0.5 0"
                  margin="0 5 0 5"
                />
              </PieLabel>
            </PieSlice>
          </Repeater>
        </PieChart>
      </PieLabelsContainer>
    </Svg>
    <LabelsTopLayout columns={2} mod={["stretch", "fixed"]}>
      <Slider
        value={m.count}
        minValue={1}
        maxValue={30}
        step={1}
        label="Points"
        help={{ tpl: "{count:n;0}" }}
      />
      <Slider
        value={m.distance}
        minValue={0}
        maxValue={200}
        label="Distance"
        help={{ tpl: "{distance:n;0}px" }}
      />
      <Switch value={m.autoAlign} label="Auto-align" />
    </LabelsTopLayout>
  </div>
);
// @index-end
