import { ContainerBase, ContainerConfig } from "../ui/Container";
import { Instance } from "../ui/Instance";
import { Prop } from "../ui/Prop";
import type { RenderingContext } from "../ui/RenderingContext";
import { VDOM, Widget } from "../ui/Widget";
import { isFunction, isNonEmptyArray } from "../util";
import { isArray } from "../util/isArray";

type ReactElementWrapperConfigBase = Omit<ContainerConfig, "items">;

// CxJS callback type - can be string (controller method) or callback with Instance as this
type CxCallback<T> = T extends (...args: infer A) => infer R ? (this: Instance, ...args: A) => R : T;

// Transform a single prop: functions to CxCallback, data to Prop<T>
type TransformProp<K, V> = K extends keyof ReactElementWrapperConfigBase
   ? ReactElementWrapperConfigBase[K]
   : NonNullable<V> extends Function
     ? CxCallback<V>
     : Prop<V>;

// Transform React component props - functions to CxCallback, data props to Prop<T>
// Preserves required/optional status
type TransformReactElementProps<T> = {
   [K in keyof T]: TransformProp<K, T[K]>;
};

/** ReactElementWrapper configuration with component-specific props */
// componentType is not included here - it's added by the jsx-runtime and declared in the class
export type ReactElementWrapperConfig<P> = ReactElementWrapperConfigBase & TransformReactElementProps<P>;

interface ReactElementWrapperInstance extends Instance {
   events?: Record<string, Function>;
}

export class ReactElementWrapper<C extends React.ComponentType<any> = React.ComponentType<any>> extends ContainerBase<
   ReactElementWrapperConfigBase & { componentType: C; jsxAttributes?: string[] },
   ReactElementWrapperInstance
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

   public initInstance(_context: RenderingContext, _instance: ReactElementWrapperInstance): void {
      let events: Record<string, Function> | undefined;
      if (!isNonEmptyArray(this.jsxAttributes)) return;
      events = {};
      for (let prop of this.jsxAttributes) {
         let f = this[prop];
         if (prop.startsWith("on") && isFunction(f)) events[prop] = (...args: any[]) => f.apply(_instance, args);
      }
   }

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(
         {
            props: { structured: true },
         },
         ...args,
      );
   }

   render(context: RenderingContext, instance: ReactElementWrapperInstance, key: string): React.ReactNode {
      const { data } = instance;

      // Render CxJS children to React elements
      let children = this.renderChildren(context, instance);
      if (children && isArray(children) && children.length === 0) children = undefined;

      const props = {
         key,
         ...data.props,
         ...instance.events,
         children,
      };

      return VDOM.createElement(this.componentType, props);
   }
}
