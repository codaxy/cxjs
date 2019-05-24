import {getCurrentInstance} from "../ui/createFunctionalComponent";

export function useEffect(callback) {
   let destroyCallback = callback();
   if (destroyCallback)
      getCurrentInstance().subscribeOnDestroy(destroyCallback);
}

export function useCleanup(cleanupCallback) {
   let unsubscribe = getCurrentInstance().subscribeOnDestroy(cleanupCallback);
   return () => {
      unsubscribe();
      cleanupCallback();
   }
}