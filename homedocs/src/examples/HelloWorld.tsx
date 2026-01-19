import { createFunctionalComponent } from "cx/ui";
import { TextField, HtmlElement } from "cx/widgets";

export default () =>
  createFunctionalComponent(() => (
    <cx>
      <div>
        <TextField
          value-bind="name"
          placeholder="Enter your name..."
          style="margin-bottom: 12px; width: 100%;"
        />
        <p>
          Hello <strong text-bind="name">World</strong>!
        </p>
      </div>
    </cx>
  ));
