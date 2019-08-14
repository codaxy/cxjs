import { useStore } from "cx/hooks";
import { TextField } from "cx/widgets";
import { Ref } from "cx/data";
import { createFunctionalComponent } from "cx/ui";

function useLocalStorage(key) {
   let store = useStore();

   return new Ref({
      get() {
         let json = localStorage.getItem(key);
         if (!json) 
            return localStorage.hasOwnProperty(key) ? null : undefined;
         return JSON.parse(json);
      },
      set(value) {
         if (value === undefined) 
            localStorage.removeItem(key);
         else 
            localStorage.setItem(key, JSON.stringify(value));
         store.meta.version++;
         store.notify();
      }
   })
}

const View = createFunctionalComponent(() => {
   let ref = useLocalStorage("test");

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
)