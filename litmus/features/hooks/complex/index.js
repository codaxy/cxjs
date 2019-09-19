import {createFunctionalComponent} from "cx/ui";
import {getModel} from "./model";
import {List, TextField} from "cx/widgets";
import {computable} from "cx/data";
import {ref} from "cx/hooks";
import {Button} from "cx/widgets";

const Lookup = createFunctionalComponent(({value}) => {

   let {status, data, query, onClear} = getModel();

   let valueRef = ref(value);
   let isLoading = computable(status, s => s == "loading");

   return <cx>
      <div>
         <TextField value={query}/>
         <p
            visible={isLoading}
         >
            Loading...
         </p>

         <List
            visible={() => status.get() == "ok"}
            records={data} style="height: 200px; width: 200px" mod="bordered"
            onItemClick={(e, {store}) => {
               valueRef.set(store.get("$record.name"));
            }}
         >
            <div text-tpl="{$record.name}"/>
         </List>
         <Button onClick={onClear}>Clear</Button>
      </div>
   </cx>
});

export default <cx>
   <div>
      <Lookup value-bind="value"/>
      <div text-bind="value"/>
      <Lookup value-bind="value"/>
   </div>
</cx>