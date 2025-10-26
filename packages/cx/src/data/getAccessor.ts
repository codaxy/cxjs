import { Binding, isBinding } from "./Binding";
import { isSelector } from "./isSelector";
import { getSelector } from "./getSelector";
import { isObject } from "../util/isObject";
import { AccessorChain, isAccessorChain } from "./createAccessorModelProxy";
import { Prop } from "../ui/Prop";
import { View } from "./View";

/*
   Accessor provides a common ground between refs and bindings.
   Refs offer simplicity, bindings have better performance with more arguments.
   Accessor works as a common interface which works with both patterns.
 */

export interface Accessor<T = any> {
   get: (data: any) => T;
   set?: (value: T, store: View) => boolean;
   bindInstance?(instance: any): Accessor;
   isAccessor?: boolean;
   isRef?: boolean;
}

export function getAccessor<T = any>(accessor: Prop<T>): Accessor;
export function getAccessor(accessor: Accessor): Accessor;

export function getAccessor(accessor: any): Accessor | undefined {
   if (accessor == null) return undefined;

   if (isObject(accessor)) {
      if ("isAccessor" in accessor || "isRef" in accessor) return accessor as Accessor;
      if (isBinding(accessor)) {
         let binding = Binding.get(accessor);
         return {
            get: binding.value,
            set: (v, store) => store.set(binding.path, v),
            isAccessor: true,
         };
      }
   }

   if (isAccessorChain(accessor)) {
      let binding = Binding.get(accessor);
      return {
         get: binding.value,
         set: (v, store) => store.set(binding.path, v),
         isAccessor: true,
      };
   }

   if (isSelector(accessor)) {
      let selector = getSelector(accessor);
      if (accessor && accessor.set)
         return {
            get: selector,
            isAccessor: true,
            bindInstance(instance) {
               return {
                  get: selector,
                  set: (value) => accessor.set(value, instance),
                  isAccessor: true,
               };
            },
         };

      return {
         get: selector,
         isAccessor: true,
      };
   }

   return {
      get: () => accessor,
   };
}
