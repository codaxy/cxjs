import {useEffect} from "./useEffect";

export function useInterval(callback, timeout) {
   return useEffect(() => {
      let timer = setInterval(callback, timeout);
      return () => {
         clearInterval(timer);
      }
   })
}