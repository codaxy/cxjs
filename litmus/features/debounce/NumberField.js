import { NumberField } from "cx/widgets";

export default (
   <cx>
      <div>
         <NumberField value={{ bind: "number", debounce: 1000 }} reactOn="change" />
         <NumberField value={{ bind: "number", debounce: 1000 }} />
      </div>
   </cx>
);
