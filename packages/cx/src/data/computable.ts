//@ts-nocheck
import { Binding } from "./Binding";
import { isString } from "../util/isString";
import { isFunction } from "../util/isFunction";
import { isAccessorChain } from "./createAccessorModelProxy";

export function computable(...selectorsAndCompute) {
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

   let selector = (data) =>
      compute.apply(
         null,
         inputs.map((s) => s(data))
      );
   selector.memoize = memoize;
   return selector;
}
