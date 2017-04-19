import * as Cx from '../core';

export class Widget extends Cx.Widget<Cx.WidgetProps> {
    static create(type: any, config: any, more: any): any;
    static resetCounter() : void;
}

export interface VDOM {
   createElement(type, props, ...children);
}

export function contentAppend(result, w, prependSpace) : boolean;

export function getContentArray(x) : any[];

export function getContent(x) : null | any | any[];
