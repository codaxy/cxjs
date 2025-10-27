import { Selector } from "../core";
import { BindingObject, isBindingObject } from "../data/Binding";
import { expression } from "../data/Expression";
import { getSelector } from "../data/getSelector";
import { Ref } from "../data/Ref";
import { stringTemplate } from "../data/StringTemplate";
import { View } from "../data/View";
import { getCurrentInstance } from "../ui/createFunctionalComponent";
import { GetSet, Prop } from "../ui/Prop";
import { hasFunctionAtKey, hasStringAtKey } from "../util/hasKey";
import { isObject } from "../util/isObject";

export function useStore(): View {
   return getCurrentInstance().store;
}

export function useStoreMethods(): ReturnType<View["getMethods"]> {
   return getCurrentInstance().store.getMethods();
}

export type RefInput<T> = Prop<T> | Ref<T>;

export function ref<T = any>(input: BindingObject): GetSet<T>;
export function ref<T = any>(input: Ref<T>): GetSet<T>;
export function ref<T = any>(input: Prop<T>): Selector<T>;
export function ref<T = any>(info: unknown): GetSet<T> | Selector<T> {
   if (isObject(info)) {
      if (isBindingObject(info)) return useStore().ref(info.bind, info.defaultValue);
      if (hasFunctionAtKey(info, "get")) return info as unknown as Ref<T>;
      if (hasFunctionAtKey(info, "memoize")) return info as unknown as Selector<T>;
      if (hasStringAtKey(info, "expr")) {
         let store = useStore();
         let selector = expression(info.expr).memoize();
         return new Ref<T>({ get: () => selector(store.getData()), set: (info as any).set }) as unknown as Selector<T>;
      }
      if (hasStringAtKey(info, "tpl")) {
         let store = useStore();
         let selector = stringTemplate(info.tpl).memoize();
         return new Ref<T>({ get: () => selector(store.getData()), set: (info as any).set }) as unknown as Selector<T>;
      }
   }
   return getSelector(info);
}
