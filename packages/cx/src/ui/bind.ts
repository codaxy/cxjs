import { Bind } from "./Prop";
import { AccessorChain } from "../data/createAccessorModelProxy";

export function bind(path: string | AccessorChain<unknown>, defaultValue?: unknown): Bind {
   return {
      //toString will ensure chain accessors are converted to strings
      bind: path.toString(),
      defaultValue,
   };
}
