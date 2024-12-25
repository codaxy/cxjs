import { createLocalStorageRef } from "cx/hooks";
import { TextField } from "cx/widgets";
import { createFunctionalComponent } from "cx/ui";

const View = createFunctionalComponent(() => {
   let ref = createLocalStorageRef("test");

   return (
      <cx>
         <div>
            <TextField value={ref} />
            <TextField value={ref} />
         </div>
      </cx>
   );
});

export default (
   <cx>
      <View />
   </cx>
);
