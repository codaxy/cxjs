import {View} from "./View";

export interface Accessor {
   get: (data: any) => any,
   set?: (value: any, store: View) => boolean
}

export function getAccessor(accessor) : Accessor;