import { Binding } from "./Binding";
import { isString } from "../util/isString";
import { isFunction } from "../util/isFunction";
import { isAccessorChain } from "./createAccessorModelProxy";
import { Selector } from "./Selector";

interface AccessorChain<T> {
   toString(): string;
}

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

export function computable<V1, R>(arg1: AccessorChain<V1>, compute: (v1: V1) => R): Selector<R>;
export function computable<V1, V2, R>(
   arg1: AccessorChain<V1>,
   arg2: AccessorChain<V2>,
   compute: (v1: V1, v2: V2) => R,
): Selector<R>;

export function computable<V1, V2, V3, R>(
   arg1: AccessorChain<V1>,
   arg2: AccessorChain<V2>,
   arg3: AccessorChain<V3>,
   compute: (v1: V1, v2: V2, v3: V3) => R,
): Selector<R>;

export function computable<V1, V2, V3, V4, R>(
   arg1: AccessorChain<V1>,
   arg2: AccessorChain<V2>,
   arg3: AccessorChain<V3>,
   arg4: AccessorChain<V4>,
   compute: (v1: V1, v2: V2, v3: V3, v4: V4) => R,
): Selector<R>;

export function computable<V1, V2, V3, V4, V5, R>(
   arg1: AccessorChain<V1>,
   arg2: AccessorChain<V2>,
   arg3: AccessorChain<V3>,
   arg4: AccessorChain<V4>,
   arg5: AccessorChain<V5>,
   compute: (v1: V1, v2: V2, v3: V3, v4: V4, v5: V5) => R,
): Selector<R>;

export function computable<V1, V2, V3, V4, V5, V6, R>(
   arg1: AccessorChain<V1>,
   arg2: AccessorChain<V2>,
   arg3: AccessorChain<V3>,
   arg4: AccessorChain<V4>,
   arg5: AccessorChain<V5>,
   arg6: AccessorChain<V6>,
   compute: (v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6) => R,
): Selector<R>;

export function computable<V1, V2, V3, V4, V5, V6, V7, R>(
   arg1: AccessorChain<V1>,
   arg2: AccessorChain<V2>,
   arg3: AccessorChain<V3>,
   arg4: AccessorChain<V4>,
   arg5: AccessorChain<V5>,
   arg6: AccessorChain<V6>,
   arg7: AccessorChain<V7>,
   compute: (v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6, v7: V7) => R,
): Selector<R>;

export function computable<V1, V2, V3, V4, V5, V6, V7, V8, R>(
   arg1: AccessorChain<V1>,
   arg2: AccessorChain<V2>,
   arg3: AccessorChain<V3>,
   arg4: AccessorChain<V4>,
   arg5: AccessorChain<V5>,
   arg6: AccessorChain<V6>,
   arg7: AccessorChain<V7>,
   arg8: AccessorChain<V8>,
   compute: (v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6, v7: V7, v8: V8) => R,
): Selector<R>;

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
