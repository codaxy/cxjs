import type { JSX as ReactJSX } from "react";
import { Widget } from "./ui/Widget";
import { isArray } from "./util/isArray";
import { isString } from "./util/isString";
import { HtmlElement, HtmlElementConfig } from "./widgets/HtmlElement";

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

type CxIntrinsicElements = {
   [K in keyof ReactIntrinsicElements]: HtmlElementConfig<K>;
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
