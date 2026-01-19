import { createModel } from "cx/data";
import { Controller, registerKeyboardShortcut } from "cx/ui";
import { KeyCode } from "cx/util";
import { Checkbox } from "cx/widgets";

// @model
interface PageModel {
  enterPressed: boolean;
  shiftAPressed: boolean;
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller {
  unregisterEnter!: () => void;
  unregisterShiftA!: () => void;

  onInit() {
    this.unregisterEnter = registerKeyboardShortcut(KeyCode.enter, () => {
      this.store.toggle(m.enterPressed);
    });

    this.unregisterShiftA = registerKeyboardShortcut(
      { keyCode: KeyCode.a, shiftKey: true },
      () => {
        this.store.toggle(m.shiftAPressed);
      },
    );
  }

  onDestroy() {
    this.unregisterEnter();
    this.unregisterShiftA();
  }
}
// @controller-end

// @index
export default () => (
  <div class="flex flex-col gap-4" controller={PageController}>
    <div class="text-sm text-gray-600">
      Click outside the checkboxes and press the shortcuts:
    </div>
    <div class="flex flex-col gap-2">
      <Checkbox value={m.enterPressed} text="Enter" readOnly />
      <Checkbox value={m.shiftAPressed} text="Shift + A" readOnly />
    </div>
  </div>
);
// @index-end
