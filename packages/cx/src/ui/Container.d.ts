import * as Cx from '../core';
import {Component} from './Component';

type Filter = string | Component;

export class Container extends Cx.Widget<Cx.PureContainerProps> {

   add(...args: Array<any>);
   
   clear();

   addText(text: string);

   find(filter: Filter, options?: Cx.Config) : any[];

   findFirst(filter: Filter, options?: Cx.Config) : any;

}
