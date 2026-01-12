/** @jsxImportSource cx */
import { ProgressBar, Slider } from "cx/widgets";
import { bind, expr } from "cx/ui";

export default () => (
  <cx>
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <ProgressBar
        value={bind("value")}
        text={expr("({value} * 100 || 0).toFixed(0) + '%'")}
      />
      <Slider value={bind("value")} maxValue={1} />

      <div style="margin-top: 16px;">
        <div style="margin-bottom: 8px;">25%</div>
        <ProgressBar value={0.25} />
      </div>

      <div>
        <div style="margin-bottom: 8px;">50%</div>
        <ProgressBar value={0.5} />
      </div>

      <div>
        <div style="margin-bottom: 8px;">75%</div>
        <ProgressBar value={0.75} />
      </div>
    </div>
  </cx>
);
