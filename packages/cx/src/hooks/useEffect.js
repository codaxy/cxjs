import {getCurrentInstance} from "../ui/createFunctionalComponent";

export function useEffect(callback) {
   let destroyCallback = callback();
   if (destroyCallback)
      getCurrentInstance().subscribeOnDestroy(destroyCallback);
}