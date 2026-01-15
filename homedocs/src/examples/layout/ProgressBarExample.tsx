import { createAccessorModelProxy } from "cx/data";
import { ProgressBar, Slider } from "cx/widgets";
import { LabelsTopLayout, LabelsTopLayoutCell, format } from "cx/ui";

// @model
interface PageModel {
  progress: number;
}

const m = createAccessorModelProxy<PageModel>();
// @model-end

// @index
export default () => (
  <LabelsTopLayout>
    <Slider
      value={m.progress}
      minValue={0}
      maxValue={1}
      step={0.01}
      label="Progress:"
    />
    <LabelsTopLayoutCell style="vertical-align: middle">
      <ProgressBar
        value={m.progress}
        text={format(m.progress, "p;0")}
        style="height: 20px"
      />
    </LabelsTopLayoutCell>
  </LabelsTopLayout>
);
// @index-end
