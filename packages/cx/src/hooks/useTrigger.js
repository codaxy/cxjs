import { getCurrentInstance } from "../ui/createFunctionalComponent";
import { isArray } from "../util/isArray";
import { computable } from "../data/computable";
import { useStore } from "./store";

export function addExploreCallback(callback) {
   let instance = getCurrentInstance();
   if (!instance.computables) instance.computables = [];
   instance.computables.push(callback);
   return () => {
      instance.computables = instance.computables.filter((cb) => cb !== callback);
   };
}

export function useTrigger(args, callback, autoRun) {
   if (!isArray(args)) throw new Error("First argument to addTrigger should be an array.");
   let store = useStore();
   let selector = computable(...args, callback).memoize(!autoRun && store.getData());
   return addExploreCallback(selector);
}
