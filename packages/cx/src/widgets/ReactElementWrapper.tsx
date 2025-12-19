import type { ComponentProps } from "react";
import { Instance } from "../ui/Instance";
import { ContainerBase, ContainerConfig } from "../ui/Container";
import { VDOM } from "../ui/Widget";
import type { RenderingContext } from "../ui/RenderingContext";
import { isArray } from "../util/isArray";
import { Prop } from "../ui/Prop";

/** Base configuration for ReactElementWrapper */
export interface ReactElementWrapperConfigBase extends ContainerConfig {
   /** The React component to render */
   componentType: React.ComponentType<any>;
}

// Keys in T where the value is a function
type FunctionKeys<T> = {
   [K in keyof T]: NonNullable<T[K]> extends Function ? K : never;
}[keyof T];

// Transform React component props - functions unchanged, data props to Prop<T>
type TransformReactElementProps<T> = {
   [K in Exclude<keyof T, FunctionKeys<T>>]: K extends "children" ? T[K] : Prop<T[K]>;
} & Pick<T, FunctionKeys<T>>;

/** ReactElementWrapper configuration with component-specific props */
export type ReactElementWrapperConfig<C extends React.ComponentType<any> = React.ComponentType<any>> = Omit<
   ReactElementWrapperConfigBase,
   "componentType"
> &
   TransformReactElementProps<ComponentProps<C>> & { componentType: C };

export class ReactElementWrapper<
   C extends React.ComponentType<any> = React.ComponentType<any>,
> extends ContainerBase<ReactElementWrapperConfig<C>> {
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
