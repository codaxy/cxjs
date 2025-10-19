import { getCurrentInstance } from "../ui/createFunctionalComponent";
import { isArray } from "../util/isArray";
import { computable, ComputableSelector } from "../data/computable";
import { useStore } from "./store";

export function addExploreCallback(callback: (...args: any[]) => any): () => void {
   let instance = getCurrentInstance();
   if (!instance.computables) instance.computables = [];
   instance.computables.push(callback);
   return () => {
      if (instance.computables) {
         instance.computables = instance.computables.filter((cb: unknown) => cb !== callback);
      }
   };
}

export function useTrigger(
   args: ComputableSelector[],
   callback: (...args: any[]) => void,
   autoRun?: boolean,
): () => void {
   if (!isArray(args)) throw new Error("First argument to useTrigger should be an array.");
   let store = useStore();
   let selector = computable(...args, callback).memoize(!autoRun && store.getData());
   return addExploreCallback(selector);
}
