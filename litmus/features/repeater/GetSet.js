import {Repeater} from "cx/ui";
import {TextField, Button} from "cx/widgets";
import {append} from "cx/data";

export default <cx>
   <div>
      <Repeater
         records={{
            get: data => data.records,
            set: (value, {store}) => {
               store.set("records", value);
            }
         }}
      >
         <div>
            <TextField value-bind="$record.name"/>
            <TextField value-bind="$record.name"/>
         </div>
      </Repeater>

      <Button
         onClick={(e, {store}) => {
            store.update("records", append, {});
         }}
      >
         Add
      </Button>
   </div>
</cx>