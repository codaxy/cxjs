import { isFunction } from "./isFunction";
import { isString } from "./isString";

export function hasKey<K extends string>(obj: object, key: K): obj is Record<K, unknown> {
   return key in obj;
}

export function hasStringAtKey<K extends string>(obj: object, key: K): obj is Record<K, string> {
   return hasKey(obj, key) && isString(obj[key]);
}

export function hasValueAtKey<K extends string>(obj: object, key: K, value: unknown): obj is Record<K, unknown> {
   return hasKey(obj, key) && obj[key] === value;
}

export function hasFunctionAtKey<K extends string>(obj: object, key: K): obj is Record<K, (...args: any[]) => any> {
   return hasKey(obj, key) && isFunction(obj[key]);
}
