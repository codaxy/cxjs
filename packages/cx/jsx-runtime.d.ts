import * as React from "react";
import type { JSX as ReactJSX } from "react";
import { HtmlElementProps, Prop, StringProp, Widget } from "./src/core";

export function jsx(typeName: any, props: any, key?: string): any;
export const jsxs: typeof jsx;

type ReactIntrinsicElements = ReactJSX.IntrinsicElements;

// Instance type for CxJS event handlers
interface Instance {
   [key: string]: any;
}

// Check if a key is an event handler (starts with "on" and is a function)
type IsEventHandler<K, T> = K extends `on${string}` ? (T extends Function ? true : false) : false;

// CxJS event handler type - can be string (controller method) or callback with Instance
type CxEventHandler<T> = T extends (event: infer E) => any
   ? string | ((event: E, instance: Instance) => void)
   : string | T;

type CxIntrinsicElement<T> = {
   [K in keyof T]: IsEventHandler<K, T[K]> extends true ? CxEventHandler<T[K]> : Prop<T[K]>;
} & HtmlElementProps;

type CXIntrinsicElements = {
   [K in keyof ReactIntrinsicElements]: CxIntrinsicElement<ReactIntrinsicElements[K]>;
};

declare namespace JSX {
   interface IntrinsicElements extends CXIntrinsicElements {}

   interface ElementClass extends Widget<any> {}
}
