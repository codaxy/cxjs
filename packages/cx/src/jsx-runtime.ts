import type { JSX as ReactJSX } from "react";
import { Instance } from "./ui/Instance";
import type { ClassProp, Prop } from "./ui/Prop";
import { Widget } from "./ui/Widget";
import { isArray } from "./util/isArray";
import { isString } from "./util/isString";
import { HtmlElement, HtmlElementConfig } from "./widgets/HtmlElement";
import { ChildNode } from "./ui/Container";

export function jsx(typeName: any, props: any, key?: string): any {
   if (isArray(typeName)) return typeName;

   // if (isFunction(typeName) && isUndefined(props))
   //    return createFunctionalComponent((config) => typeName(flattenProps(config)));

   if (typeName.type || typeName.$type) return typeName;

   if (props.children && isArray(props.children) && props.children.length == 0) props.children = null;

   if (props.children && props.children.length == 1) props.children = props.children[0];

   if (typeName == "cx") return props.children;

   if (isString(typeName) && typeName[0] == typeName[0].toLowerCase()) {
      props.tag = typeName;
      typeName = HtmlElement;
   }

   return {
      $type: typeName,
      ...props,
      jsxAttributes: props && Object.keys(props),
   };
}

export const jsxs = jsx;

type ReactIntrinsicElements = ReactJSX.IntrinsicElements;
// Check if a key is an event handler (starts with "on" and is a function)
type IsEventHandler<K, T> = K extends `on${string}` ? (T extends Function ? true : false) : false;

// CxJS event handler type - can be string (controller method) or callback with Instance
type CxEventHandler<T> = T extends (event: infer E) => any
   ? string | ((event: E, instance: Instance) => void)
   : string | T;

type CxIntrinsicElement<T> = {
   [K in keyof T]: K extends "children"
      ? ChildNode | ChildNode[]
      : K extends "className" | "class"
        ? ClassProp
        : IsEventHandler<K, T[K]> extends true
          ? CxEventHandler<T[K]>
          : Prop<T[K]>;
} & HtmlElementConfig;

type CxIntrinsicElements = {
   [K in keyof ReactIntrinsicElements]: CxIntrinsicElement<ReactIntrinsicElements[K]>;
};

export namespace JSX {
   /**
    * Base class for JSX element instances.
    * All widgets must extend from Widget class or React.Component.
    */
   export type ElementClass = Widget<any> | React.Component<any, any>;

   /**
    * Intrinsic JSX elements (HTML-like tags).
    * Supports HTML elements that map to HtmlElement widgets.
    */
   export interface IntrinsicElements extends CxIntrinsicElements {
      cx: any;
   }
}
