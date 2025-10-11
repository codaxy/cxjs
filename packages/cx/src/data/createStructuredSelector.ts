import { Selector } from "./Selector";

interface Record {
   [prop: string]: any;
}

interface StructuredSelector {
   [prop: string]: Selector;
}

export function createStructuredSelector(selector: StructuredSelector, constants?: Record): Selector<Record> {
   let keys = Object.keys(selector);
   if (keys.length == 0) return () => constants;

   function memoize() {
      let lastResult = Object.assign({}, constants);

      let memoizedSelectors = {};

      keys.forEach((key) => {
         memoizedSelectors[key] = selector[key].memoize ? selector[key].memoize() : selector[key];
         lastResult[key] = undefined;
      });

      return function (data) {
         let result = lastResult,
            k,
            v,
            i;
         for (i = 0; i < keys.length; i++) {
            k = keys[i];
            v = memoizedSelectors[k](data);
            if (result === lastResult) {
               if (v === lastResult[k]) continue;
               result = Object.assign({}, lastResult);
            }
            result[k] = v;
         }
         return (lastResult = result);
      };
   }

   function evaluate(data) {
      let result = Object.assign({}, constants);
      for (let i = 0; i < keys.length; i++) {
         result[keys[i]] = selector[keys[i]](data);
      }
      return result;
   }

   evaluate.memoize = memoize;
   return evaluate;
}
