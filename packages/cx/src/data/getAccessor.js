import {Binding, isBinding} from "./Binding";
import {isSelector} from "./isSelector";
import {getSelector} from "./getSelector";
import {isObject} from "../util/isObject";

/*
   Accessor provides a common ground between refs and bindings.
   Refs offer simplicity, bindings have better performance with more arguments.
   Accessor works as a common interface which works with both patterns.
 */

export function getAccessor(accessor, options) {
   if (accessor == null)
      return null;

   if (isObject(accessor)) {
      if (accessor.isAccessor || accessor.isRef) return accessor;
      if (isBinding(accessor)) {
         let binding = Binding.get(accessor);
         return {
            get: binding.value,
            set: (v, store) => store.set(binding.path, v),
            isAccessor: true
         }
      }
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
                  set: value => accessor.set(value, instance),
                  isAccessor: true
               }
            }
         };

      return {
         get: selector,
         isAccessor: true
      };
   }

   return {
      get: () => accessor
   }
}
