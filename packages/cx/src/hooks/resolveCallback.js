import { isFunction } from "../util/isFunction";
import { isString } from "../util/isString";
import { getCurrentInstance } from "../ui/createFunctionalComponent";

export function resolveCallback(callback, instance) {
   if (isFunction(callback))
      return callback;
   if (isString(callback)) {
      if (!instance) instance = getCurrentInstance();
      return (...args) => instance.invokeControllerMethod(callback, ...args);
   }
}