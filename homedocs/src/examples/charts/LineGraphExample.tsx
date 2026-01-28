import { createModel } from "cx/data";
import {
  bind,
  Controller,
  expr,
  LabelsTopLayout,
  LabelsTopLayoutCell,
} from "cx/ui";
import { Slider, Switch } from "cx/widgets";
import { Svg } from "cx/svg";
import { Chart, Gridlines, Legend, LineGraph, NumericAxis } from "cx/charts";

// @model
interface DataPoint {
  x: number;
  y: number | null;
  y2: number;
  y2l: number;
  y2h: number;
}

interface Model {
  points: DataPoint[];
  pointsCount: number;
  showArea: boolean;
  showLine: boolean;
  smooth: boolean;
  smoothingRatio: number;
  line1: boolean;
  line2: boolean;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.init(m.pointsCount, 50);
    this.store.init(m.showArea, true);
    this.store.init(m.showLine, true);
    this.store.init(m.smooth, true);
    this.store.init(m.smoothingRatio, 0.07);

    this.addTrigger(
      "on-count-change",
      [m.pointsCount],
      (cnt) => {
        let y1 = 250,
          y2 = 350;
        this.store.set(
          m.points,
          Array.from({ length: cnt }, (_, i) => ({
            x: i * 4,
            y: i % 20 === 3 ? null : (y1 = y1 + (Math.random() - 0.5) * 30),
            y2: (y2 = y2 + (Math.random() - 0.5) * 30),
            y2l: y2 - 50,
            y2h: y2 + 50,
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
    <Svg style="width: 100%; height: 300px;">
      <Chart
        offset="20 -10 -40 40"
        axes={{
          x: { type: NumericAxis, lineStyle: "stroke: transparent" },
          y: { type: NumericAxis, vertical: true },
        }}
      >
        <Gridlines />
        <LineGraph
          name="Series 2"
          data={m.points}
          colorIndex={8}
          yField="y2h"
          y0Field="y2l"
          active={bind(m.line2, true)}
          line={false}
          area={m.showArea}
          smooth={m.smooth}
          smoothingRatio={m.smoothingRatio}
        />
        <LineGraph
          name="Series 1"
          data={m.points}
          colorIndex={0}
          area={m.showArea}
          active={bind(m.line1, true)}
          smooth={m.smooth}
          smoothingRatio={m.smoothingRatio}
          line={m.showLine}
        />
        <LineGraph
          name="Series 2"
          data={m.points}
          colorIndex={8}
          yField="y2"
          active={bind(m.line2, true)}
          smooth={m.smooth}
          smoothingRatio={m.smoothingRatio}
          line={m.showLine}
        />
      </Chart>
    </Svg>

    <LabelsTopLayout columns={4} mod="stretch">
      <LabelsTopLayoutCell colSpan={2}>
        <Slider
          label="Data points count"
          maxValue={200}
          minValue={5}
          step={1}
          value={bind(m.pointsCount, 50)}
          help={expr(m.pointsCount, (v) => `${v} points`)}
        />
      </LabelsTopLayoutCell>
      <Switch label="Area" value={m.showArea} />
      <Switch label="Line" value={m.showLine} />

      <Switch label="Smooth" value={m.smooth} style="margin-right: 20px" />
      <Slider
        label="Smoothing ratio"
        enabled={m.smooth}
        value={bind(m.smoothingRatio, 0.07)}
        maxValue={0.4}
        minValue={0}
        step={0.01}
        help={expr(m.smoothingRatio, (v) => v?.toFixed(2) ?? "")}
      />
    </LabelsTopLayout>
  </div>
);
// @index-end
