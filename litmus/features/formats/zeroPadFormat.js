import { TextField, NumberField } from "cx/widgets";

export default (
   <cx>
      <div styles="height: 60px;">
         <TextField value-bind="value" label="Value" />
         <NumberField readOnly value-bind="value" format="zeropad;2" label="Formatted Value" />
      </div>
   </cx>
);
