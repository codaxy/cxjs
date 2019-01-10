import {Selector} from '../core';

export function expression(str: string) : Selector<any>;

export class Expression {

   static get(str: string): Selector<any>;

   static compile(str: string): Selector<any>;

   static registerHelper(name: string, helper);

   static expandFatArrows: boolean;
}

export function invalidateExpressionCache();
