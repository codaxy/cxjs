import {useStore} from "cx/hooks";
import {TextField} from "cx/widgets";
import {Ref} from "cx/data";

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

const View = () => <cx>
   <div>
      <TextField value={useLocalStorage("test")} />
      <TextField value={useLocalStorage("test")} />
   </div>
</cx>

export default <cx>
   <View/>
</cx>