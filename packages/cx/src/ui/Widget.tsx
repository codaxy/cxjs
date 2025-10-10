import { Component } from "../util/Component";
import { CSSHelper } from "./CSSHelper";
import "./CSS";
import { StructuredSelector } from "../data/StructuredSelector";
import { parseStyle } from "../util/parseStyle";
import { isString } from "../util/isString";
import { isDefined } from "../util/isDefined";
import { isArray } from "../util/isArray";
import { Console } from "../util/Console";
import { RenderingContext } from "./RenderingContext";

import { VDOM as vdom } from "./VDOM";
export const VDOM = vdom;

let widgetId = 100;

export class Widget extends Component {
   public widgetId?: number;
   public jsxSpread?: Record<string, any>[];
   public jsxAttributes?: string[];
   public styles?: any;
   public style?: any;
   public styled?: boolean;
   public if?: any;
   public visible?: boolean;
   public outerLayout?: Widget;
   public contentFor?: string;
   public putInto?: string;
   public isContent?: boolean;
   public CSS?: any;
   public initialized?: boolean;
   public components?: Record<string, any>;
   public helpers?: Record<string, any>;
   public selector?: StructuredSelector;
   public nameMap?: any;
   public baseClass?: string;
   public version?: number;
   public memoize?: boolean;

   // Lifecycle hooks
   public onInit?: (context: RenderingContext, instance: any) => void;
   public onExplore?: (context: RenderingContext, instance: any) => void;
   public onPrepare?: (context: RenderingContext, instance: any) => void;
   public onCleanup?: (context: RenderingContext, instance: any) => void;
   public onDestroy?: (instance: any) => void;

   // Controller
   public controller?: any;

   // Pure container flag
   public isPureContainer?: boolean;

   public static optimizePrepare?: boolean;

   constructor(config?: any) {
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
         this.CSS.block(this.baseClass, data.mod, data.stateMods),
         data.class,
         data.className,
      );
      data.style = parseStyle(data.style);
   }

   public prepareData(context: RenderingContext, instance: any): void {
      if (this.styled) this.prepareCSS(context, instance);
   }

   public initInstance(_context: RenderingContext, _instance: any): void {}

   public initState(_context: RenderingContext, _instance: any): void {}

   public checkVisible(_context: RenderingContext, _instance: any, data: any): boolean {
      return data.visible;
   }

   public explore(context: RenderingContext, instance: any): void {
      if (this.components) instance.components = {};
      for (const cmp in this.components) {
         const ins = instance.getChild(context, this.components[cmp], "cmp-" + cmp, instance.store);
         if (ins.scheduleExploreIfVisible(context)) instance.components[cmp] = ins;
      }
   }

   public render(_context: RenderingContext, _instance: any, _key: any): any {
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

   public static resetCounter(): void {
      widgetId = 100;
   }
}

Widget.prototype.visible = true;
Widget.prototype.memoize = true; //cache rendered content and use it if possible
Widget.prototype.CSS = "cx";
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
   let result = [];
   contentAppend(result, x, false);
   return result;
}

export function getContent(x: any): any {
   let result = getContentArray(x);
   if (result.length == 0) return null;
   if (result.length == 1) return result[0];
   return result;
}
