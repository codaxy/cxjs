import { Binding } from "../Binding";

export function merge<T extends object>(item: T, data?: Partial<T>): T {
   let result = item;

   if (data) {
      for (const key in data) {
         result = Binding.get(key).set(result, data[key]);
      }
   }

   return result;
}
