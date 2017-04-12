import * as Cx from '../core';

export class CSS {

   push(list?: string[], item?: string): string[];

   pushMore(list?: string[], itemArray?: string): string[];

   pushMap(list?: string[], itemArray?: string, mapF?: any): string[];

   join(list?: string[]): string;

   static resolve(...args): string[];

   static block(baseClass: string, styleModifiers: any, stateModifiers: any): string;

   static element(baseClass: string, elementClass: string, stateModifiers: any): string;

   static state(stateModifiers: any): string;

   static expand(...args): string;

   static parseStyle(str: string): {};
   static parseStyle(str: any): any;

   static classPrefix: string;
}