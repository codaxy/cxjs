import type { JSX as ReactJSX, ComponentType, ComponentProps, FunctionComponent, ComponentClass } from "react";
import { Widget } from "./ui/Widget";
import { isArray } from "./util/isArray";
import { isString } from "./util/isString";
import { HtmlElement, HtmlElementConfig, HtmlElementConfigBase, CxTransformProps } from "./widgets/HtmlElement";
import type { CxFunctionalComponent } from "./ui/createFunctionalComponent";

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

/** Config type for React components used inside CxJS JSX */
export type ReactComponentConfig<C extends ComponentType<any>> = Omit<HtmlElementConfigBase, "tag"> &
   CxTransformProps<ComponentProps<C>> & { tag?: C };

// Helper type to transform props for React components (but not CxJS functional components)
// Uses a workaround to avoid TypeScript inference issues with conditional types in LibraryManagedAttributes
type TransformReactComponentProps<C, P> = [C] extends [CxFunctionalComponent<any>]
   ? P // CxJS functional components already have proper types
   : [C] extends [FunctionComponent<any>]
     ? ReactComponentConfig<C & FunctionComponent<any>>
     : [C] extends [ComponentClass<any>]
       ? ReactComponentConfig<C & ComponentClass<any>>
       : P;

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

   /**
    * Transform props for React function components used in CxJS JSX.
    * Adds standard WidgetConfig properties and transforms React props to Prop<X>.
    */
   export type LibraryManagedAttributes<C, P> = TransformReactComponentProps<C, P>;
}
