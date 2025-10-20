import { MemoSelector, Selector } from "./Selector";

export interface StructuredSelectorConfig {
   [prop: string]: Selector;
}

// Helper type to infer result type from selector config
type InferStructuredSelectorResult<T extends StructuredSelectorConfig, C = {}> = {
   [K in keyof T]: T[K] extends Selector<infer R> ? R : any;
} & C;

export function createStructuredSelector<S extends StructuredSelectorConfig, C extends Record<string, any> = {}>(
   selector: S,
   constants?: C,
): MemoSelector<InferStructuredSelectorResult<S, C>> {
   let keys = Object.keys(selector);
   constants = constants ?? ({} as C);
   if (keys.length == 0) {
      let result: Selector = () => constants;
      result.memoize = () => result;
      return result as MemoSelector<InferStructuredSelectorResult<S, C>>;
   }

   function memoize() {
      let lastResult: Record<string, any> = Object.assign({}, constants);

      let memoizedSelectors: Record<string, Selector> = {};

      keys.forEach((key) => {
         memoizedSelectors[key] = selector[key].memoize ? selector[key].memoize() : selector[key];
         lastResult[key] = undefined;
      });

      return function (data: any) {
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

   let result: Selector = function evaluate(data: any) {
      let result: Record<string, any> = Object.assign({}, constants);
      for (let i = 0; i < keys.length; i++) {
         result[keys[i]] = selector[keys[i]](data);
      }
      return result;
   };

   result.memoize = memoize;
   return result as MemoSelector<InferStructuredSelectorResult<S, C>>;
}
