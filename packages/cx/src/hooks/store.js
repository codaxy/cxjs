import {getCurrentInstance} from "../ui/createFunctionalComponent";
import {getSelector} from "../data/getSelector";
import {isObject} from "../util/isObject";

export function useStore() {
   return getCurrentInstance().store;
}

export function useStoreMethods() {
   return getCurrentInstance().store.getMethods();
}

export function ref(info) {
   if (isObject(info)) {
      if (info.bind)
         return useStore().ref(info.bind, info.defaultValue);
      if (info.get)
         return info;
      if (info.expr)
         throw new Error("Not supported yet.");
   }
   return getSelector(info);
}
