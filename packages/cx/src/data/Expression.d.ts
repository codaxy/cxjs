import {Selector} from '../core';

export function expression(str: string) : Selector;

export class Expression {

   static get(str: string): Selector;

   static compile(str: string): Selector;

   static registerHelper(name: string, helper);

   static expandFatArrows: boolean;
}

