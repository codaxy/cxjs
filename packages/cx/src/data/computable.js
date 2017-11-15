import {Binding} from './Binding';
import {isString} from '../util/isString';
import {isFunction} from '../util/isFunction';

export function computable(...selectorsAndCompute) {

   if (selectorsAndCompute.length == 0)
      throw new Error('computable requires at least a compute function to be passed in arguments.');

   let compute = selectorsAndCompute[selectorsAndCompute.length - 1];
   if (typeof compute != 'function')
      throw new Error('Last argument to the computable function should be a function.');

   let inputs = [], a;

   for (let i = 0; i + 1 < selectorsAndCompute.length; i++) {
      a = selectorsAndCompute[i];
      if (isString(a))
         inputs.push(Binding.get(a).value);
      else if (a.createSelector)
         inputs.push(a.createSelector());
      else if (isFunction(a))
         inputs.push(a);
      else
         throw new Error(`Invalid selector type '${typeof(a)}' received.`);
   }

   function memoize(amnesia, warmupData) {

      let lastValue,
         lastArgs = warmupData && inputs.map((s, i) => s(warmupData));

      return function (data) {
         let dirty = amnesia;

         if (!lastArgs) {
            lastArgs = Array.from({length: inputs.length});
            dirty = true;
         }

         for (let i = 0; i < inputs.length; i++) {
            let v = inputs[i](data);
            if (v !== lastArgs[i])
               dirty = true;
            lastArgs[i] = v;
         }

         if (dirty)
            lastValue = compute.apply(null, lastArgs);

         return lastValue;
      }
   }

   let selector = memoize(true);
   selector.memoize = memoize;
   return selector;
}
