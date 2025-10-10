import { Bind, AccessorChain } from "../core";

export function bind(path: string | AccessorChain<any>, defaultValue?: any): Bind {
   return {
      //toString will ensure chain accessors are converted to strings
      bind: path.toString(),
      defaultValue,
   };
}
