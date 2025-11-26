import { Binding } from "../data/Binding";
import { isString } from "../util/isString";
import { AccessorChain } from "../data/createAccessorModelProxy";
import { Selector } from "../data/Selector";
import { Expr } from "./Prop";

export function expr(code: string): Expr;
export function expr<V1, R>(arg1: AccessorChain<V1>, compute: (v1: V1) => R): Selector<R>;
export function expr<V1, V2, R>(
   arg1: AccessorChain<V1>,
   arg2: AccessorChain<V2>,
   compute: (v1: V1, v2: V2) => R,
): Selector<R>;
export function expr<V1, V2, V3, R>(
   arg1: AccessorChain<V1>,
   arg2: AccessorChain<V2>,
   arg3: AccessorChain<V3>,
   compute: (v1: V1, v2: V2, v3: V3) => R,
): Selector<R>;
export function expr<V1, V2, V3, V4, R>(
   arg1: AccessorChain<V1>,
   arg2: AccessorChain<V2>,
   arg3: AccessorChain<V3>,
   arg4: AccessorChain<V4>,
   compute: (v1: V1, v2: V2, v3: V3, v4: V4) => R,
): Selector<R>;
export function expr<T extends AccessorChain<any>[], R>(
   ...args: [...accessors: T, compute: (...values: { [K in keyof T]: T[K] extends AccessorChain<infer V> ? V : never }) => R]
): Selector<R>;
export function expr(...args: any[]): any {
   let text = args[0];
   if (isString(text))
      return {
         expr: text,
      };

   let getters: any[] = [];
   let compute = args[args.length - 1];
   for (let i = 0; i < args.length - 1; i++) getters.push(Binding.get(args[i]).value);
   return (data: any) => {
      let argv = getters.map((g) => g(data));
      return compute.apply(null, argv);
   };
}
