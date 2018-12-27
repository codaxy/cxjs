import {Selector} from '../core';

export function stringTemplate(str: string): Selector<string>;

export class StringTemplate {

   static get(str: string): Selector<string>;

   static compile(str: string): Selector<string>;

   static format(format: string, ...args): string;
}

export function invalidateStringTemplateCache();