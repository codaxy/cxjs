/** @jsxImportSource cx */
import { TextField } from "cx/widgets";
import { bind, expr } from "cx/ui";

export default () => (
  <cx>
    <div>
      <TextField value={bind("name")} placeholder="What is your name?" />
      <p>
        Hello <strong text={expr("{name} || 'World'")} />!
      </p>
    </div>
  </cx>
);
