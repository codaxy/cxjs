import { HtmlElement, TextField, Slider } from "cx/widgets";
import { LabelsLeftLayout } from "cx/ui";

export default (
   <cx>
      <div ws>
         <h3>Home</h3>
         <LabelsLeftLayout>
            <TextField label="Unbound (missing strokes):" />
            <TextField value={{ bind: "$page.name", debounce: 5000 }} showClear label="Delayed 5000:" />
            <TextField value={{ bind: "$page.name", debounce: 500 }} showClear label="Delayed 500:" />
            <TextField value-bind="$page.name" showClear label="Default (OK):" />

            <Slider value={{ bind: "$page.number", debounce: 5000 }} label="5000" />
            <Slider value={{ bind: "$page.number", debounce: 500 }} label="500" />
            <Slider value={{ bind: "$page.number", debounce: 0 }} label="0" />
         </LabelsLeftLayout>
      </div>
   </cx>
);
