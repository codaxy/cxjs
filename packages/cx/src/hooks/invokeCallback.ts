import { isFunction } from "../util/isFunction";
import { isString } from "../util/isString";
import { Instance } from "../ui/Instance";

export function invokeCallback(instance: Instance, callback: string | ((...args: any[]) => any), ...args: any[]): any {
   if (isString(callback)) return instance.invokeControllerMethod(callback, ...args);
   if (isFunction(callback)) return callback(...args);
}
