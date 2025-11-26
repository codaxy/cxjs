import { StructuredSelector } from "../data/StructuredSelector";
import { Component } from "../util/Component";
import { Console } from "../util/Console";
import { isArray } from "../util/isArray";
import { isDefined } from "../util/isDefined";
import { isString } from "../util/isString";
import { parseStyle } from "../util/parseStyle";
import { CSS } from "./CSS";
import { CSSHelper } from "./CSSHelper";
import { RenderingContext } from "./RenderingContext";
import type { Controller, ControllerConfig } from "./Controller";

import { BooleanProp, ClassProp, ModProp, StyleProp } from "./Prop";
import { Instance } from "./Instance";
import { VDOM as vdom } from "./VDOM";
import { ViewMethods } from "../data/View";

export const VDOM = vdom;

let widgetId = 100;

// Controller property accepts: class, instance, config object, or factory function
export type ControllerProp =
   | typeof Controller
   | Controller
   | ControllerConfig
   | ((config: ViewMethods) => ControllerConfig);

export interface WidgetConfig {
   /** Visibility of the widget. Defaults to `true`. */
   visible?: BooleanProp;

   /** Visibility of the widget. Defaults to `true`. */
   if?: BooleanProp;

   /** Outer (wrapper) layout used to display the widget in. */
   outerLayout?: unknown;

   /** Inner layout used to display children inside the widget. */
   layout?: unknown;

   /** Name of the ContentPlaceholder that should be used to display the widget. */
   contentFor?: string;

   /** Name of the ContentPlaceholder that should be used to display the widget. */
   putInto?: string;

   /** Key that will be used as the key when rendering the React component.  */
   vdomKey?: string;

   /** Controller. */
   controller?: ControllerProp;

   onInit?(context: RenderingContext): void;
   onExplore?(context: RenderingContext, instance: Instance): void;
   onPrepare?(context: RenderingContext, instance: Instance): void;
   onCleanup?(context: RenderingContext, instance: Instance): void;
   onDestroy?(instance: Instance): void;
}

/** Style-related config properties for widgets that support styling. */
export interface WidgetStyleConfig {
   /**
    * Additional CSS classes to be applied to the element.
    * If an object is provided, all keys with a "truthy" value will be added to the CSS class list.
    */
   class?: ClassProp;

   /**
    * Additional CSS classes to be applied to the element.
    * If an object is provided, all keys with a "truthy" value will be added to the CSS class list.
    */
   className?: ClassProp;

   /** Style object applied to the element. */
   style?: StyleProp;

   /** Style object applied to the element. */
   styles?: StyleProp;

   /** Base CSS class to be applied to the element. For example, value 'button' will add a class 'cxb-button' to the element. */
   baseClass?: string;

   /** Appearance modifier. For example, mod="big" will add the CSS class .cxm-big to the block element. */
   mod?: ModProp;
}

export abstract class Widget<
   Config extends WidgetConfig = WidgetConfig,
   InstanceType extends Instance = Instance,
> extends Component {
   public widgetId?: number;
   declare public vdomKey?: string | number;
   public jsxSpread?: Record<string, any>[];
   public jsxAttributes?: string[];
   declare public styles?: any;
   declare public style?: any;
   declare public styled: boolean;
   declare public if?: any;
   declare public visible: boolean;
   declare public outerLayout?: Widget;
   declare public contentFor?: string;
   declare public putInto?: string;
   public isContent?: boolean;
   declare public CSS: typeof CSS;
   public initialized?: boolean;
   public components?: Record<string, any>;
   public helpers?: Record<string, any>;
   public selector?: StructuredSelector;
   public nameMap?: any;
   declare public baseClass?: string;
   public version?: number;
   declare public memoize: boolean;

   // Lifecycle hooks - callbacks that can be set in configuration
   declare public onInit?: (context: RenderingContext, instance: Instance) => void;
   declare public onExplore?: (context: RenderingContext, instance: Instance) => void;
   declare public onPrepare?: (context: RenderingContext, instance: Instance) => void;
   declare public onCleanup?: (context: RenderingContext, instance: Instance) => void;
   declare public onDestroy?: (instance: Instance) => void;

   // Lifecycle methods that can be overridden by subclasses
   public exploreCleanup?(context: RenderingContext, instance: InstanceType): void;
   public prepareCleanup?(context: RenderingContext, instance: InstanceType): void;
   public cleanup?(context: RenderingContext, instance: InstanceType): void;
   public prepare?(context: RenderingContext, instance: InstanceType): void;

   // Controller (initialized instance)
   declare public controller?: Controller;

   // Pure container flag
   declare public isPureContainer?: boolean;
   declare public useParentLayout?: boolean;

   public static optimizePrepare?: boolean;

   constructor(config?: Config) {
      super(config);
      this.widgetId = widgetId++;

      if (isArray(this.jsxSpread)) {
         if (!this.jsxAttributes) this.jsxAttributes = [];

         this.jsxSpread.forEach((spread: Record<string, any>) => {
            for (const key in spread) {
               (this as any)[key] = spread[key];
               this.jsxAttributes!.push(key);
            }
         });
      }
   }

   public init(): void {
      if (this.styles) this.style = this.styles;

      if (this.styled) this.style = parseStyle(this.style);
      else if (this.style) {
         Console.warn(
            "Components that allow use of the style attribute should set styled = true on their prototype. This will be an error in future versions.",
         );
         this.style = parseStyle(this.style);
         this.styled = true;
      }

      if (typeof this.if !== "undefined") this.visible = this.if;

      this.declareData();

      if (this.outerLayout) {
         if (isArray(this.outerLayout)) throw new Error("Only single element outer layout is supported.");
         //TODO: better handle the case when outer layout is an array. How to get around circular dependency to PureContainer
         this.outerLayout = Widget.create(this.outerLayout, {});
      }

      if (this.contentFor) this.putInto = this.contentFor;

      if (this.putInto) this.isContent = true;

      if (isString(this.CSS)) this.CSS = CSSHelper.get(this.CSS);

      this.initHelpers();
      this.initComponents();

      this.initialized = true;
   }

   protected initComponents(...args: Record<string, any>[]): void {
      if (args.length > 0) {
         this.components = Object.assign({}, ...args);
         for (const k in this.components) {
            if (!this.components[k]) delete this.components[k];
         }
      }
   }

   protected initHelpers(...args: Record<string, any>[]): void {
      if (args.length > 0) {
         this.helpers = Object.assign({}, ...args);
      }
   }

   protected declareData(...args: Record<string, any>[]): void {
      const options: Record<string, any> = {};

      if (this.styled) {
         options.class = options.className = options.style = { structured: true };
      }

      const props = {
         visible: undefined,
         mod: {
            structured: true,
         },
         ...options,
      };

      Object.assign(props, ...args);
      this.selector = new StructuredSelector({ props: props, values: this });
      this.nameMap = this.selector.nameMap;
   }

   protected prepareCSS(_context: RenderingContext, { data }: any): void {
      data.classNames = this.CSS.expand(
         this.CSS.block(this.baseClass!, data.mod, data.stateMods),
         data.class,
         data.className,
      );
      data.style = parseStyle(data.style);
   }

   public prepareData(context: RenderingContext, instance: InstanceType): void {
      if (this.styled) this.prepareCSS(context, instance);
   }

   public initInstance(_context: RenderingContext, _instance: InstanceType): void {}

   public initState(_context: RenderingContext, _instance: InstanceType): void {}

   public checkVisible(_context: RenderingContext, _instance: InstanceType, data: any): boolean {
      return data.visible;
   }

   public explore(context: RenderingContext, instance: InstanceType, data?: any): void {
      if (this.components) {
         instance.components = {};
         for (const cmp in this.components) {
            const ins = instance.getChild(context, this.components[cmp], "cmp-" + cmp, instance.store);
            if (ins.scheduleExploreIfVisible(context)) instance.components[cmp] = ins;
         }
      }
   }

   public render(context: RenderingContext, instance: InstanceType, key: string): any {
      Console.log(this);
      throw new Error(
         'Widget\'s render method should be overridden. This error usually happens if with incorrect imports, i.e. import { TextField } from "cx/data". Please check the console for details about the component configuration.',
      );
   }

   public update(): void {
      this.version = (this.version || 0) + 1;
   }

   public applyParentStore(instance: any): void {
      instance.store = instance.parentStore;

      // check when this is actually needed, perhaps this is needed only for tables and repeated elements
      // if (instance.cached) delete instance.cached.rawData; // force prepareData to execute again
   }

   // Overload create to return Widget type instead of any
   public static create(typeAlias?: any, config?: any, more?: any): Widget {
      return super.create(typeAlias, config, more) as Widget;
   }

   public static resetCounter(): void {
      widgetId = 100;
   }
}

Widget.prototype.visible = true;
Widget.prototype.memoize = true; //cache rendered content and use it if possible
Widget.prototype.CSS = CSS;
Widget.prototype.styled = false;

Widget.namespace = "ui.";
Widget.optimizePrepare = true;

Widget.factory = (type: string, _config?: any, _more?: any) => {
   throw new Error(`Invalid widget type: ${type}.`);
};

export function contentAppend(result: any[], w: any, prependSpace?: boolean): boolean {
   if (w == null || w === false) return false;
   if (isArray(w)) w.forEach((c: any) => contentAppend(result, c));
   else if (isDefined(w.content) && !w.atomic) return contentAppend(result, w.content, false);
   else {
      if (prependSpace) result.push(" ");
      result.push(w);
   }
   return true;
}

export function getContentArray(x: any): any[] {
   let result: any[] = [];
   contentAppend(result, x, false);
   return result;
}

export function getContent(x: any): any {
   let result = getContentArray(x);
   if (result.length == 0) return null;
   if (result.length == 1) return result[0];
   return result;
}
