import { TimeField } from "cx/widgets";

export default (
   <cx>
      <div>
         <TimeField value-bind="time" />
         <TimeField value-bind="time" picker="list" step={10} />
         <TimeField value-bind="time" picker="list" step={15} />
         <TimeField value-bind="time" picker="list" step={30} />
      </div>
   </cx>
);
