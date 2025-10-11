import { Binding } from "./Binding";
import { isString } from "../util/isString";
import { isFunction } from "../util/isFunction";
import { isAccessorChain } from "./createAccessorModelProxy";
import { Selector } from "./Selector";

interface AccessorChain<T> {
   toString(): string;
}

type UnwrapAccessorChain<T> = T extends AccessorChain<infer U> ? U : never;

type ComputableArgs<Args extends AccessorChain<any>[], R> = [
   ...args: Args,
   compute: (...values: { [K in keyof Args]: UnwrapAccessorChain<Args[K]> }) => R,
];

export function computable<Args extends AccessorChain<any>[], R>(...args: ComputableArgs<Args, R>): Selector<R>;

// Backwards compatibility
export function computable(callback: () => any): Selector;
export function computable(p1: string, computeFn: (v1: any) => any): Selector;
export function computable(p1: string, p2: string, computeFn: (v1: any, v2: any) => any): Selector;
export function computable(p1: string, p2: string, p3: string, computeFn: (v1: any, v2: any, v3: any) => any): Selector;
export function computable(
   p1: string,
   p2: string,
   p3: string,
   p4: string,
   computeFn: (v1: any, v2: any, v3: any, v4: any) => any,
): Selector;
export function computable(
   p1: string,
   p2: string,
   p3: string,
   p4: string,
   p5: string,
   computeFn: (v1: any, v2: any, v3: any, v4: any, v5: any) => any,
): Selector;
export function computable(
   p1: string,
   p2: string,
   p3: string,
   p4: string,
   p5: string,
   p6: string,
   computeFn: (v1: any, v2: any, v3: any, v4: any, v5: any, v6: any) => any,
): Selector;
export function computable(
   p1: string,
   p2: string,
   p3: string,
   p4: string,
   p5: string,
   p6: string,
   p7: string,
   computeFn: (v1: any, v2: any, v3: any, v4: any, v5: any, v6: any, v7: any) => any,
): Selector;
export function computable(
   p1: string,
   p2: string,
   p3: string,
   p4: string,
   p5: string,
   p6: string,
   p7: string,
   p8: string,
   computeFn: (v1: any, v2: any, v3: any, v4: any, v5: any, v6: any, v7: any, v8: any) => any,
): Selector;

export function computable(...selectorsAndCompute: any[]): Selector {
   if (selectorsAndCompute.length == 0)
      throw new Error("computable requires at least a compute function to be passed in arguments.");

   let compute = selectorsAndCompute[selectorsAndCompute.length - 1];
   if (typeof compute != "function") throw new Error("Last argument to the computable function should be a function.");

   let inputs = [],
      a;

   for (let i = 0; i + 1 < selectorsAndCompute.length; i++) {
      a = selectorsAndCompute[i];
      if (isString(a) || isAccessorChain(a)) inputs.push(Binding.get(a.toString()).value);
      else if (a.memoize) inputs.push(a.memoize());
      else if (isFunction(a)) inputs.push(a);
      else throw new Error(`Invalid selector type '${typeof a}' received.`);
   }

   function memoize(warmupData) {
      let lastValue,
         lastArgs = warmupData && inputs.map((s) => s(warmupData));

      return function (data) {
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
   return selector;
}
