import { HtmlElement, TextField } from "cx/widgets";

export default (
   <cx>
      <div ws>
         <h3>Home</h3>
         Unbound (missing strokes):
         <TextField />
         <br />
         Delayed (missing strokes):
         <TextField value={{ bind: "$page.name", debounce: 300 }} />
         <br />
         Default (OK):
         <TextField value-bind="$page.name" />
      </div>
   </cx>
);
