import { createModel } from "cx/data";
import { bind, tpl, expr, LabelsTopLayout, Controller } from "cx/ui";
import { Svg, Rectangle, Line } from "cx/svg";
import { NumberField, Resizer, LookupField } from "cx/widgets";

// @model
interface Model {
  width: number;
  height: number;
  anchorT: number;
  anchorR: number;
  anchorB: number;
  anchorL: number;
  offsetT: number;
  offsetR: number;
  offsetB: number;
  offsetL: number;
  preset: string;
  focusAnchorT: boolean;
  focusAnchorR: boolean;
  focusAnchorB: boolean;
  focusAnchorL: boolean;
  focusOffsetT: boolean;
  focusOffsetR: boolean;
  focusOffsetB: boolean;
  focusOffsetL: boolean;
}

const m = createModel<Model>();
// @model-end

const presets = [
  {
    id: "full",
    text: "Full",
    anchors: [0, 1, 1, 0],
    offset: [10, -10, -10, 10],
  },
  {
    id: "left-half",
    text: "Left Half",
    anchors: [0, 0.5, 1, 0],
    offset: [10, 0, -10, 10],
  },
  {
    id: "right-half",
    text: "Right Half",
    anchors: [0, 1, 1, 0.5],
    offset: [10, -10, -10, 0],
  },
  {
    id: "top-half",
    text: "Top Half",
    anchors: [0, 1, 0.5, 0],
    offset: [10, -10, 0, 10],
  },
  {
    id: "bottom-half",
    text: "Bottom Half",
    anchors: [0.5, 1, 1, 0],
    offset: [0, -10, -10, 10],
  },
  {
    id: "top-left",
    text: "Top Left",
    anchors: [0, 0.5, 0.5, 0],
    offset: [10, 0, 0, 10],
  },
  {
    id: "top-right",
    text: "Top Right",
    anchors: [0, 1, 0.5, 0.5],
    offset: [10, -10, 0, 0],
  },
  {
    id: "bottom-left",
    text: "Bottom Left",
    anchors: [0.5, 0.5, 1, 0],
    offset: [0, 0, -10, 10],
  },
  {
    id: "bottom-right",
    text: "Bottom Right",
    anchors: [0.5, 1, 1, 0.5],
    offset: [0, -10, -10, 0],
  },
  {
    id: "center",
    text: "Center",
    anchors: [0.25, 0.75, 0.75, 0.25],
    offset: [0, 0, 0, 0],
  },
  {
    id: "center-offset",
    text: "Center (Offset)",
    anchors: [0.5, 0.5, 0.5, 0.5],
    offset: [-50, 50, 50, -50],
  },
];

// @controller
class PageController extends Controller<typeof m> {
  onInit() {
    this.addTrigger("preset-changed", [m.preset], (preset) => {
      const p = presets.find((x) => x.id === preset);
      if (p) {
        this.store.set(m.anchorT, p.anchors[0]);
        this.store.set(m.anchorR, p.anchors[1]);
        this.store.set(m.anchorB, p.anchors[2]);
        this.store.set(m.anchorL, p.anchors[3]);
        this.store.set(m.offsetT, p.offset[0]);
        this.store.set(m.offsetR, p.offset[1]);
        this.store.set(m.offsetB, p.offset[2]);
        this.store.set(m.offsetL, p.offset[3]);
      }
    });
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController}>
    <LabelsTopLayout>
      <LookupField
        value={bind(m.preset, "full")}
        label="Preset"
        options={presets}
        style="width: 220px"
        required
      />
    </LabelsTopLayout>
    <strong class="block -mb-2">Anchors</strong>
    <LabelsTopLayout>
      <NumberField
        value={bind(m.anchorT, 0)}
        label="Top"
        style="width: 60px"
        minValue={0}
        maxValue={1}
        step={0.1}
        format="n;1"
        reactOn="enter blur wheel"
        trackFocus
        focused={m.focusAnchorT}
      />
      <NumberField
        value={bind(m.anchorR, 1)}
        label="Right"
        style="width: 60px"
        minValue={0}
        maxValue={1}
        step={0.1}
        format="n;1"
        reactOn="enter blur wheel"
        trackFocus
        focused={m.focusAnchorR}
      />
      <NumberField
        value={bind(m.anchorB, 1)}
        label="Bottom"
        style="width: 60px"
        minValue={0}
        maxValue={1}
        step={0.1}
        format="n;1"
        reactOn="enter blur wheel"
        trackFocus
        focused={m.focusAnchorB}
      />
      <NumberField
        value={bind(m.anchorL, 0)}
        label="Left"
        style="width: 60px"
        minValue={0}
        maxValue={1}
        step={0.1}
        format="n;1"
        reactOn="enter blur wheel"
        trackFocus
        focused={m.focusAnchorL}
      />
    </LabelsTopLayout>

    <strong class="block mt-4 -mb-2">Offset</strong>
    <LabelsTopLayout>
      <NumberField
        value={bind(m.offsetT, 10)}
        label="Top"
        style="width: 60px"
        step={5}
        reactOn="enter blur wheel"
        trackFocus
        focused={m.focusOffsetT}
      />
      <NumberField
        value={bind(m.offsetR, -10)}
        label="Right"
        style="width: 60px"
        step={5}
        reactOn="enter blur wheel"
        trackFocus
        focused={m.focusOffsetR}
      />
      <NumberField
        value={bind(m.offsetB, -10)}
        label="Bottom"
        style="width: 60px"
        step={5}
        reactOn="enter blur wheel"
        trackFocus
        focused={m.focusOffsetB}
      />
      <NumberField
        value={bind(m.offsetL, 10)}
        label="Left"
        style="width: 60px"
        step={5}
        reactOn="enter blur wheel"
        trackFocus
        focused={m.focusOffsetL}
      />
    </LabelsTopLayout>

    <div class="flex mt-4">
      <div>
        <Svg
          style={{
            width: bind(m.width, 300),
            height: bind(m.height, 200),
          }}
          padding={1}
        >
          {/* Anchor lines - show where percentage anchors are positioned */}
          <Line
            anchors={tpl(m.anchorT, "{0} 1 {0} 0")}
            style={expr(m.focusAnchorT, (f) => `stroke: ${f ? "red" : "#ccc"}; stroke-width: ${f ? 2 : 1}`)}
          />
          <Line
            anchors={tpl(m.anchorB, "{0} 1 {0} 0")}
            style={expr(m.focusAnchorB, (f) => `stroke: ${f ? "red" : "#ccc"}; stroke-width: ${f ? 2 : 1}`)}
          />
          <Line
            anchors={tpl(m.anchorL, "0 {0} 1 {0}")}
            style={expr(m.focusAnchorL, (f) => `stroke: ${f ? "red" : "#ccc"}; stroke-width: ${f ? 2 : 1}`)}
          />
          <Line
            anchors={tpl(m.anchorR, "0 {0} 1 {0}")}
            style={expr(m.focusAnchorR, (f) => `stroke: ${f ? "red" : "#ccc"}; stroke-width: ${f ? 2 : 1}`)}
          />
          {/* Offset lines - show pixel displacement from anchor to rectangle edge */}
          <Line
            anchors={expr(m.anchorT, m.anchorL, m.anchorR, (t, l, r) => `${t} ${(l + r) / 2} ${t} ${(l + r) / 2}`)}
            offset={tpl(m.offsetT, "0 0 {0} 0")}
            style={expr(m.focusOffsetT, (f) => `stroke: ${f ? "red" : "#ccc"}; stroke-width: ${f ? 2 : 1}`)}
          />
          <Line
            anchors={expr(m.anchorB, m.anchorL, m.anchorR, (b, l, r) => `${b} ${(l + r) / 2} ${b} ${(l + r) / 2}`)}
            offset={tpl(m.offsetB, "0 0 {0} 0")}
            style={expr(m.focusOffsetB, (f) => `stroke: ${f ? "red" : "#ccc"}; stroke-width: ${f ? 2 : 1}`)}
          />
          <Line
            anchors={expr(m.anchorL, m.anchorT, m.anchorB, (l, t, b) => `${(t + b) / 2} ${l} ${(t + b) / 2} ${l}`)}
            offset={tpl(m.offsetL, "0 {0} 0 0")}
            style={expr(m.focusOffsetL, (f) => `stroke: ${f ? "red" : "#ccc"}; stroke-width: ${f ? 2 : 1}`)}
          />
          <Line
            anchors={expr(m.anchorR, m.anchorT, m.anchorB, (r, t, b) => `${(t + b) / 2} ${r} ${(t + b) / 2} ${r}`)}
            offset={tpl(m.offsetR, "0 {0} 0 0")}
            style={expr(m.focusOffsetR, (f) => `stroke: ${f ? "red" : "#ccc"}; stroke-width: ${f ? 2 : 1}`)}
          />
          {/* Rectangle rendered last to appear on top */}
          <Rectangle
            anchors={tpl(
              m.anchorT,
              m.anchorR,
              m.anchorB,
              m.anchorL,
              "{0} {1} {2} {3}",
            )}
            offset={tpl(
              m.offsetT,
              m.offsetR,
              m.offsetB,
              m.offsetL,
              "{0} {1} {2} {3}",
            )}
            style="fill: lightblue; stroke: steelblue"
          />
        </Svg>
        <Resizer size={bind(m.height, 200)} horizontal />
      </div>
      <Resizer size={bind(m.width, 300)} />
    </div>
  </div>
);
// @index-end
