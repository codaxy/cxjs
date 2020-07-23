import { getCurrentInstance } from "../ui/createFunctionalComponent";
import { getSelector } from "../data/getSelector";
import { isObject } from "../util/isObject";
import { expression } from "../data/Expression";
import { stringTemplate } from "../data/StringTemplate";
import { Ref } from "../data/Ref";

export function useStore() {
   return getCurrentInstance().store;
}

export function useStoreMethods() {
   return getCurrentInstance().store.getMethods();
}

export function ref(info) {
   if (isObject(info)) {
      if (info.bind) return useStore().ref(info.bind, info.defaultValue);
      if (info.get) return info;
      if (info.expr) {
         let store = useStore();
         let selector = expression(info.expr).memoize();
         return new Ref({ get: () => selector(store.getData()), set: info.set });
      }
      if (info.tpl) {
         let store = useStore();
         let selector = stringTemplate(info.tpl).memoize();
         return new Ref({ get: () => selector(store.getData()), set: info.set });
      }
   }
   return getSelector(info);
}
