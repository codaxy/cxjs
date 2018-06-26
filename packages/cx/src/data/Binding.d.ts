import { Record } from '../core';

export class Binding {

   constructor(path: string);

   set(state: Record, value: any): Record;

   delete(state: Record): Record;

   static get(path: string): Binding;
}

export function isBinding(value: any): boolean;