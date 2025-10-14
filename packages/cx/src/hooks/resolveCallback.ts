import { isFunction } from "../util/isFunction";
import { isString } from "../util/isString";
import { getCurrentInstance } from "../ui/createFunctionalComponent";
import { Instance } from "../ui/Instance";

export function resolveCallback(
   callback: string | ((...args: any[]) => any),
   instance?: Instance,
): ((...args: any[]) => any) | undefined {
   if (isFunction(callback)) return callback;
   if (isString(callback)) {
      if (!instance) instance = getCurrentInstance();
      return (...args: any[]) => instance!.invokeControllerMethod(callback, ...args);
   }
   return undefined;
}
