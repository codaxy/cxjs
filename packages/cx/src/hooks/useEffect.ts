import { getCurrentInstance } from "../ui/createFunctionalComponent";

export function useEffect(callback: () => (() => void) | void): void {
   let destroyCallback = callback();
   if (destroyCallback) getCurrentInstance().subscribeOnDestroy(destroyCallback);
}

export function useCleanup(cleanupCallback: () => void): () => void {
   let unsubscribe = getCurrentInstance().subscribeOnDestroy(cleanupCallback);
   return () => {
      unsubscribe();
      cleanupCallback();
   };
}
