import { TimeField, DateField } from "cx/widgets";

export default (
   <cx>
      <div>
         <DateField value-bind="time" partial />
         <TimeField value-bind="time" partial />
         <TimeField value-bind="time" picker="list" step={10} partial />
         <TimeField value-bind="time" picker="list" step={15} partial />
         <TimeField value-bind="time" picker="list" step={30} partial />
      </div>
   </cx>
);
