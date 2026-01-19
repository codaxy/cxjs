/** @jsxImportSource cx */
import { TextField, Slider, Button } from "cx/widgets";
import { Controller } from "cx/ui";

class DemoController extends Controller {
  onInit() {
    this.store.set("name", "CxJS");
    this.store.set("count", 5);
  }

  increment() {
    this.store.update("count", (c) => c + 1);
  }

  decrement() {
    this.store.update("count", (c) => Math.max(0, c - 1));
  }
}

export default () => (
  <cx>
    <div controller={DemoController} style="width: 100%;">
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 13px; color: #6b7280; margin-bottom: 6px;">
          Your name
        </label>
        <TextField value-bind="name" style="width: 100%;" />
      </div>

      <div style="padding: 16px; background: linear-gradient(135deg, rgba(39, 170, 225, 0.1) 0%, rgba(91, 186, 199, 0.1) 100%); border-radius: 8px; text-align: center; margin-bottom: 16px;">
        <span style="font-size: 18px;">
          Hello, <strong text-bind="name" />!
        </span>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 13px; color: #6b7280; margin-bottom: 6px;">
          Counter: <strong text-bind="count" />
        </label>
        <Slider
          value-bind="count"
          minValue={0}
          maxValue={20}
          step={1}
          style="width: 100%;"
        />
      </div>

      <div style="display: flex; gap: 8px;">
        <Button onClick="decrement" mod="hollow" style="flex: 1;">
          - Decrease
        </Button>
        <Button onClick="increment" mod="primary" style="flex: 1;">
          + Increase
        </Button>
      </div>
    </div>
  </cx>
);
