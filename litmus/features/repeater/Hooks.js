import {Repeater, createFunctionalComponent} from "cx/ui";
import {TextField, Button} from "cx/widgets";
import {append, ArrayRef, updateArray} from "cx/data";
import {ref} from "cx/hooks";

export default createFunctionalComponent(() => {

   let records = ref({ bind: "records" });

   return <cx>
      <div>
         <Repeater
            records={records}
         >
            <div>
               <TextField value-bind="$record.name"/>
               <TextField value-bind="$record.name"/>
            </div>
         </Repeater>

         <Button
            onClick={(e, {store}) => {
               records.update(data => [...(data || []), {}]);
            }}
         >
            Add
         </Button>
      </div>
   </cx>
});