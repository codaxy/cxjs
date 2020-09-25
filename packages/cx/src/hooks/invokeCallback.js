import { isFunction } from "../util/isFunction";
import { isString } from "../util/isString";

export function invokeCallback(instance, callback, ...args) {
   if (isString(callback)) return instance.invokeControllerMethod(callback, ...args);
   if (isFunction(callback)) return callback(...args);
}