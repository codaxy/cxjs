import { Record, AccessorChain } from "../core";

export class Binding<V = any> {
   constructor(path: string);

   set(state: Record, value: V): Record;

   delete(state: Record): Record;

   value(state: Record): any;

   static get(path: string): Binding;
   static get<V>(chain: AccessorChain<V>): Binding<V>;
}

export function isBinding(value: any): boolean;
