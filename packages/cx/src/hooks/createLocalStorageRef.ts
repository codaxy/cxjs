import { useStore } from "./store";
import { Ref } from "../data/Ref";

export function createLocalStorageRef<T = any>(key: string): Ref<T> {
   let store = useStore();

   return new Ref<T>({
      get(): T {
         let json = localStorage.getItem(key);
         if (!json) return localStorage.hasOwnProperty(key) ? (null as any) : (undefined as any);
         return JSON.parse(json) as T;
      },
      set(value: T): boolean {
         if (value === undefined) localStorage.removeItem(key);
         else localStorage.setItem(key, JSON.stringify(value));
         store.meta.version++;
         store.notify();
         return true;
      },
   });
}
