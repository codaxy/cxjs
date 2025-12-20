import type { ComponentProps } from "react";
import { Instance } from "../ui/Instance";
import { ChildNode, ContainerBase, ContainerConfig } from "../ui/Container";
import { ControllerProp, VDOM } from "../ui/Widget";
import type { RenderingContext } from "../ui/RenderingContext";
import { isArray } from "../util/isArray";
import { Prop } from "../ui/Prop";
import { TransformHtmlElementProps } from "./HtmlElement";

// CxJS callback type - can be string (controller method) or callback with Instance as this
type CxCallback<T> = T extends (...args: infer A) => infer R
   ? string | ((this: Instance, ...args: A) => R)
   : string | T;

// Required keys in T
type RequiredKeys<T> = {
   [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

// Optional keys in T
type OptionalKeys<T> = {
   [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

// Transform a single prop: functions to CxCallback, data to Prop<T>
type TransformProp<K, V> = K extends "controller"
   ? ControllerProp
   : K extends "children"
     ? ChildNode | ChildNode[]
     : NonNullable<V> extends Function
       ? CxCallback<V>
       : Prop<V>;

// Transform React component props - functions to CxCallback, data props to Prop<T>
// Preserves required/optional status
export type TransformReactElementProps<T> = {
   [K in keyof T]: TransformProp<K, T[K]>;
};

/** ReactElementWrapper configuration with component-specific props */
// componentType is not included here - it's added by the jsx-runtime and declared in the class
export type ReactElementWrapperConfig<P> = ContainerConfig & TransformReactElementProps<P>;

export class ReactElementWrapper<C extends React.ComponentType<any> = React.ComponentType<any>> extends ContainerBase<
   ContainerConfig & { componentType: C }
> {
   declare public componentType: React.ComponentType<any>;
   declare public jsxAttributes?: string[];
   declare public props?: Record<string, unknown>;
   [key: string]: unknown;

   init(): void {
      // Collect all props to pass to the React component
      this.props = {};

      if (this.jsxAttributes) {
         for (const attr of this.jsxAttributes) {
            // Skip CxJS reserved attributes and children-related attributes
            if (
               attr === "componentType" ||
               attr === "visible" ||
               attr === "if" ||
               attr === "controller" ||
               attr === "jsxAttributes" ||
               attr === "layout" ||
               attr === "outerLayout" ||
               attr === "putInto" ||
               attr === "contentFor" ||
               attr === "children" ||
               attr === "items"
            )
               continue;

            this.props[attr] = this[attr];
         }
      }

      super.init();
   }

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(
         {
            props: { structured: true },
         },
         ...args,
      );
   }

   render(context: RenderingContext, instance: Instance, key: string): React.ReactNode {
      const { data } = instance;

      // Render CxJS children to React elements
      let children = this.renderChildren(context, instance);
      if (children && isArray(children) && children.length === 0) children = undefined;

      const props = {
         key,
         ...data.props,
         children,
      };

      return VDOM.createElement(this.componentType, props);
   }
}
