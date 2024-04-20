import { Record, AccessorChain, Bind } from "../core";

export class Binding<V = any> {
   constructor(path: string);

   readonly path: string;

   set(state: Record, value: V): Record;

   delete(state: Record): Record;

   value(state: Record): any;

   static get(path: string): Binding;
   static get(bind: Bind): Binding;
   static get<V>(chain: AccessorChain<V>): Binding<V>;
}

export function isBinding(value: any): boolean;
