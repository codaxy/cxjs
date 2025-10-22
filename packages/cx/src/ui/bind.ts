import { Bind, AccessorChain } from "../core";

export function bind(path: string | AccessorChain<unknown>, defaultValue?: unknown): Bind {
   return {
      //toString will ensure chain accessors are converted to strings
      bind: path.toString(),
      defaultValue,
   };
}
