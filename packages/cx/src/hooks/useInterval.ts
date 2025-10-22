import { useCleanup } from "./useEffect";

export function useInterval(callback: () => void, timeout: number): () => void {
   let timer = setInterval(callback, timeout);
   return useCleanup(() => {
      clearInterval(timer);
   });
}
