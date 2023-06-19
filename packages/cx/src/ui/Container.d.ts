import * as Cx from "../core";
import { Component } from "../util/Component";

type Filter = string | Component;

export class Container<Props = Cx.PureContainerProps> extends Cx.Widget<Props> {
   add(...args: Array<any>);

   clear();

   addText(text: string);

   find(filter: Filter, options?: Cx.Config): any[];

   findFirst(filter: Filter, options?: Cx.Config): any;

   renderChildren(context: any, instance: any): any;
}
