import { isFunction } from "./isFunction";
import { isObject } from "./isObject";

export function isPromise(x: unknown): x is Promise<any> {
   return isObject(x) && isFunction((x as any)["then"]);
}
