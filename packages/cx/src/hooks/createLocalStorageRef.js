import {useStore} from "./store";
import {Ref} from "../data/Ref";

export function createLoacalStorageRef(key) {
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