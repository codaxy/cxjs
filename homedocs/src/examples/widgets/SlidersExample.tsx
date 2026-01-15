/** @jsxImportSource cx */

// @model
import { createModel } from "cx/data";

interface SliderModel {
  volume: number;
  stepped: number;
  min: number;
  max: number;
}

export const $page = createModel<SliderModel>();
// @model-end

// @controller
import { Controller } from "cx/ui";

class SliderController extends Controller {
  onInit() {
    this.store.init($page.volume, 50);
    this.store.init($page.stepped, 30);
    this.store.init($page.min, 20);
    this.store.init($page.max, 80);
  }
}
// @controller-end

// @index
import { Slider, LabeledContainer } from "cx/widgets";

export default () => (
  <cx>
    <div
      controller={SliderController}
      style="display: flex; flex-direction: column; gap: 24px; width: 100%;"
    >
      <LabeledContainer label="Standard">
        <Slider value={$page.volume} />
      </LabeledContainer>

      <LabeledContainer label="With Steps (10)">
        <Slider value={$page.stepped} step={10} />
      </LabeledContainer>

      <LabeledContainer label="Range">
        <Slider from={$page.min} to={$page.max} />
      </LabeledContainer>

      <LabeledContainer label="Disabled">
        <Slider value={50} disabled />
      </LabeledContainer>
    </div>
  </cx>
);
// @index-end
