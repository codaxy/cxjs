import {useCleanup} from "./useEffect";

export function useInterval(callback, timeout) {
   let timer = setInterval(callback, timeout);
   return useCleanup(() => {
      clearInterval(timer);
   });
}