import { isObject } from "./isObject";

export function isDataRecord(v: unknown): v is Record<string, any> {
   return isObject(v);
}
