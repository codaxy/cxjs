import { Binding } from "./Binding";
import { isString } from "../util/isString";
import { isFunction } from "../util/isFunction";
import { AccessorChain, isAccessorChain } from "./createAccessorModelProxy";
import { CanMemoize, MemoSelector, Selector } from "./Selector";
import { Ref } from "./Ref";

export type ComputableSelector<T = any> = string | Selector<T> | AccessorChain<T> | CanMemoize<T>;

// Helper type to infer the value type from a selector, string, or accessor chain
type InferSelectorValue<T> =
   T extends Selector<infer R> ? R : T extends AccessorChain<infer R> ? R : T extends string ? any : never;

// Generic overload - handles all cases with proper type inference
export function computable<Selectors extends readonly any[], R>(
   ...args: [
      ...selectors: ComputableSelector[],
      compute: (...values: { [K in keyof Selectors]: InferSelectorValue<Selectors[K]> }) => R,
   ]
): MemoSelector<R>;

export function computable(...selectorsAndCompute: any[]): MemoSelector {
   if (selectorsAndCompute.length == 0)
      throw new Error("computable requires at least a compute function to be passed in arguments.");

   let compute = selectorsAndCompute[selectorsAndCompute.length - 1];
   if (typeof compute != "function") throw new Error("Last argument to the computable function should be a function.");

   let inputs: Selector[] = [],
      a;

   for (let i = 0; i + 1 < selectorsAndCompute.length; i++) {
      a = selectorsAndCompute[i];
      if (isString(a) || isAccessorChain(a)) inputs.push(Binding.get(a.toString()).value);
      else if (a.memoize) inputs.push(a.memoize());
      else if (isFunction(a)) inputs.push(a);
      else throw new Error(`Invalid selector type '${typeof a}' received.`);
   }

   function memoize(warmupData: any) {
      let lastValue: any,
         lastArgs = warmupData && inputs.map((s) => s(warmupData));

      return function (data: any) {
         let dirty = false;

         if (!lastArgs) {
            lastArgs = Array.from({ length: inputs.length });
            dirty = true;
         }

         for (let i = 0; i < inputs.length; i++) {
            let v = inputs[i](data);
            if (v === lastArgs[i]) continue;
            lastArgs[i] = v;
            dirty = true;
         }

         if (dirty) lastValue = compute.apply(null, lastArgs);

         return lastValue;
      };
   }

   let selector: Selector = (data) =>
      compute.apply(
         null,
         inputs.map((s) => s(data)),
      );
   selector.memoize = memoize;
   return selector as MemoSelector;
}
