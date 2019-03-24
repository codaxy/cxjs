import {getCurrentInstance} from "../ui/Cx";

export function useEffect(callback) {
   let destroyCallback = callback();
   if (destroyCallback)
      getCurrentInstance().subscribeOnDestroy(destroyCallback);
}