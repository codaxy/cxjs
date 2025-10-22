import type { JSX as ReactJSX } from "react";
import type { Prop } from "./ui/Prop";
import { Widget, WidgetConfig } from "./ui/Widget";
import { isArray } from "./util/isArray";
import { isString } from "./util/isString";
import { HtmlElement, HtmlElementConfig } from "./widgets/HtmlElement";
import { Instance } from "./ui/Instance";

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

/**
 * Type constraint for Widget constructor functions.
 * Ensures type safety for widget creation with optional configuration.
 */
export type WidgetConstructor<C extends WidgetConfig = WidgetConfig> = new (config?: C) => Widget<C>;

/**
 * Represents a widget node in the component tree.
 * Contains the widget constructor and optional children.
 * Supports both widget nodes and HTML element nodes.
 */
export interface CxNode {
   type: WidgetConstructor;
   children?: CxChild[];
   tagName?: string; // Present for HTML elements
   [key: string]: any; // Allow any attributes for HTML elements
}

/**
 * Valid child types that can be used within widget children arrays.
 * Supports CxNodes (JSX elements), Widget instances, primitives, and null/undefined for conditional rendering.
 */
export type CxChild = CxNode | Widget<any> | string | number | boolean | null | undefined;

type ReactIntrinsicElements = ReactJSX.IntrinsicElements;
// Check if a key is an event handler (starts with "on" and is a function)
type IsEventHandler<K, T> = K extends `on${string}` ? (T extends Function ? true : false) : false;

// CxJS event handler type - can be string (controller method) or callback with Instance
type CxEventHandler<T> = T extends (event: infer E) => any
   ? string | ((event: E, instance: Instance) => void)
   : string | T;

type CxIntrinsicElement<T> = {
   [K in keyof T]: K extends 'children'
      ? any
      : IsEventHandler<K, T[K]> extends true
         ? CxEventHandler<T[K]>
         : Prop<T[K]>;
} & HtmlElementConfig & {
   // Allow any additional properties for dynamic HTML attributes and CxJS features
   [key: string]: any;
};

type CxIntrinsicElements = {
   [K in keyof ReactIntrinsicElements]: CxIntrinsicElement<ReactIntrinsicElements[K]>;
};

export namespace JSX {
   /**
    * Base class for JSX element instances.
    * All widgets must extend from Widget class.
    */
   export interface ElementClass extends Widget<any> {}

   /**
    * Intrinsic JSX elements (HTML-like tags).
    * Supports HTML elements that map to HtmlElement widgets.
    */
   export interface IntrinsicElements extends CxIntrinsicElements {
      cx: any;
   }
}
