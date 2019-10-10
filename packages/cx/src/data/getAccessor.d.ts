import {View} from "./View";

export interface Accessor {
   get: (data: any) => any;
   set?: (value: any, store: View) => boolean;
   bindInstance?(instance: any): Accessor;
}

export function getAccessor(accessor) : Accessor;