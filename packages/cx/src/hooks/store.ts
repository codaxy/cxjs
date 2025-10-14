import { getCurrentInstance } from "../ui/createFunctionalComponent";
import { getSelector } from "../data/getSelector";
import { isObject } from "../util/isObject";
import { expression } from "../data/Expression";
import { stringTemplate } from "../data/StringTemplate";
import { Ref } from "../data/Ref";
import { Selector } from "../core";
import { View } from "../data";

export function useStore(): View {
   return getCurrentInstance().store;
}

export function useStoreMethods(): ReturnType<View["getMethods"]> {
   return getCurrentInstance().store.getMethods();
}

export function ref(info: any): Selector<any> {
   if (isObject(info)) {
      if ((info as any).bind) return useStore().ref((info as any).bind, (info as any).defaultValue);
      if ((info as any).get) return info as any;
      if ((info as any).expr) {
         let store = useStore();
         let selector = expression((info as any).expr).memoize();
         return new Ref({ get: () => selector(store.getData()), set: (info as any).set }) as any;
      }
      if ((info as any).tpl) {
         let store = useStore();
         let selector = stringTemplate((info as any).tpl).memoize();
         return new Ref({ get: () => selector(store.getData()), set: (info as any).set }) as any;
      }
   }
   return getSelector(info);
}
