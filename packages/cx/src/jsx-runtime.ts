import type { ComponentClass, FunctionComponent, JSX as ReactJSX } from "react";
import type { CxFunctionalComponent } from "./ui/createFunctionalComponent";
import { Widget } from "./ui/Widget";
import { isArray } from "./util/isArray";
import { isString } from "./util/isString";
import { HtmlElement, HtmlElementConfig } from "./widgets/HtmlElement";
import { ReactElementWrapper, ReactElementWrapperConfig } from "./widgets/ReactElementWrapper";

export function jsx(typeName: any, props: any, key?: string): any {
   if (isArray(typeName)) return typeName;

   if (key) {
      // key is allowed in CxJS, i.e. Sandbox use it
      props = {
         ...props,
         key,
      };
   }

   if (typeName.type || typeName.$type) return typeName;

   if (props.children && isArray(props.children) && props.children.length == 0) props.children = null;

   if (props.children && props.children.length == 1) props.children = props.children[0];

   if (typeName == "cx") return props.children;

   if (isString(typeName) && typeName[0] == typeName[0].toLowerCase()) {
      props.tag = typeName;
      typeName = HtmlElement;
   }
   // React components (functions/classes without isComponentType and not CxJS functional components) should go through ReactElementWrapper
   else if (typeof typeName === "function" && !typeName.isComponentType && !typeName.$isComponentFactory) {
      props.componentType = typeName;
      typeName = ReactElementWrapper;
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

// Helper type to transform props for React components (but not CxJS functional components)
// Uses a workaround to avoid TypeScript inference issues with conditional types in LibraryManagedAttributes
// We use Omit to exclude componentType since it's added automatically by the jsx-runtime
type TransformReactComponentProps<C, P> = [C] extends [CxFunctionalComponent<any>]
   ? P // CxJS functional components already have proper types
   : [C] extends [FunctionComponent<any>]
     ? ReactElementWrapperConfig<P>
     : [C] extends [ComponentClass<any>]
       ? ReactElementWrapperConfig<P>
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
