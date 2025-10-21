import { Binding, isBinding } from "./Binding";
import { isSelector } from "./isSelector";
import { getSelector } from "./getSelector";
import { isObject } from "../util/isObject";
import { AccessorChain, isAccessorChain } from "./createAccessorModelProxy";
import { Prop } from "../ui/Prop";

/*
   Accessor provides a common ground between refs and bindings.
   Refs offer simplicity, bindings have better performance with more arguments.
   Accessor works as a common interface which works with both patterns.
 */

interface View {
   set(path: string, value: any): boolean;
}

export interface Accessor {
   get: (data: any) => any;
   set?: (value: any, store: View) => boolean;
   bindInstance?(instance: any): Accessor;
   isAccessor?: boolean;
   isRef?: boolean;
}

export function getAccessor(accessor: AccessorChain<unknown>): Accessor;
export function getAccessor(accessor: Prop<unknown[]>): Accessor;

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
