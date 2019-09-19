import {getCurrentInstance} from "../ui/createFunctionalComponent";
import {isArray} from "../util/isArray";
import {computable} from "../data/computable";

export function addExploreCallback(callback) {
   let instance = getCurrentInstance();
   if (!instance.computables)
      instance.computables = [];
   instance.computables.push(callback);
   return () => {
      instance.computables = instance.computables.filter(cb => cb !== callback);
   }
}

export function useTrigger(args, callback) {
   if (!isArray(args))
      throw new Error('First argument to addTrigger should be an array.');
   let selector = computable(...args, callback).memoize();
   return addExploreCallback(selector);
}