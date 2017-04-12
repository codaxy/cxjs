import * as Cx from '../core';

export class CSS {

   static resolve(...args): string[];

   static block(baseClass: string, styleModifiers: any, stateModifiers: any): string;

   static element(baseClass: string, elementClass: string, stateModifiers: any): string;

   static state(stateModifiers: any): string;

   static expand(...args): string;

   static parseStyle(str: string): Cx.Config;
   static parseStyle(str: any): any;

   static classPrefix: string;
   
}