import {Binding} from './Binding';
import {isString} from '../util/isString';
import {isFunction} from '../util/isFunction';

export function computable(...selectorsAndCompute) {

   if (selectorsAndCompute.length == 0)
      throw new Error('computable requires at least a compute function to be passed in arguments.');

   var compute = selectorsAndCompute[selectorsAndCompute.length - 1];
   if (typeof compute != 'function')
      throw new Error('Last argument to the computable function should be a function.');

   var inputs = [], a;

   for (var i = 0; i + 1 < selectorsAndCompute.length; i++) {
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
      var lastValue,
         lastArgs = warmupData && inputs.map((s, i)=>s(warmupData));

      return function (data) {
         if (amnesia || !lastArgs)
            lastArgs = inputs.map((s, i)=>s(data));
         else {
            var dirty = 0;
            for (var i = 0; i < inputs.length; i++) {
               var oldValue = lastArgs[i];
               var newValue = inputs[i](data);
               lastArgs[i] = newValue;
               if (oldValue !== newValue)
                  dirty++;
            }
            if (!dirty)
               return lastValue;
         }

         return lastValue = compute.apply(null, lastArgs);
      }
   }

   var selector = memoize(true);
   selector.memoize = memoize;
   return selector;
}
