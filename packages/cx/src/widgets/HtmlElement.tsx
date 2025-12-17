/** @jsxImportSource react */

import type { JSX as ReactJSX } from "react";
import { Url } from "../ui/app/Url";
import { ChildNode, StyledContainerBase, StyledContainerConfig } from "../ui/Container";
import type { RenderProps, WidgetData } from "../ui/Instance";
import { Instance } from "../ui/Instance";
import { BooleanProp, ClassProp, NumberProp, Prop, StringProp, StructuredProp } from "../ui/Prop";
import type { CxChild, RenderingContext } from "../ui/RenderingContext";
import { VDOM, Widget } from "../ui/Widget";
import { debug } from "../util/Debug";
import { isArray } from "../util/isArray";
import { isDefined } from "../util/isDefined";
import { isString } from "../util/isString";
import { isUndefined } from "../util/isUndefined";
import { autoFocus } from "./autoFocus";
import type { TooltipInstance } from "./overlay/Tooltip";
import type { TooltipConfig, TooltipProp } from "./overlay/tooltip-ops";
import {
   tooltipMouseLeave,
   tooltipMouseMove,
   tooltipParentDidMount,
   tooltipParentDidUpdate,
   TooltipParentInstance,
   tooltipParentWillReceiveProps,
   tooltipParentWillUnmount,
} from "./overlay/tooltip-ops";

const isDataAttribute = (attr: string): string | false => (attr.indexOf("data-") === 0 ? attr.substring(5) : false);

export let urlAttributes: Record<string, boolean> = {
   "a.href": true,
   "img.src": true,
   "iframe.src": true,
};

type ReactIntrinsicElements = ReactJSX.IntrinsicElements;

// Check if a key is an event handler (starts with "on" and is a function)
// Use NonNullable to handle optional event handlers (T | undefined)
type IsEventHandler<K, T> = K extends `on${string}` ? (NonNullable<T> extends Function ? true : false) : false;

// CxJS event handler type - can be string (controller method) or callback with Instance
type CxEventHandler<T> = T extends (event: infer E) => any
   ? string | ((event: E, instance: Instance) => void)
   : T extends undefined
     ? undefined
     : string | T;

// Transform React element props to CxJS props
// Note: For string literal union props (like SVG's strokeLinecap), we also accept `string`
// because TypeScript widens string literals to `string` in JSX attribute syntax.
// This is a known TypeScript behavior where `<path strokeLinecap="round"/>` infers "round" as string.
export type CxTransformProps<T> = {
   [K in keyof T]: K extends "children"
      ? ChildNode | ChildNode[]
      : K extends "className" | "class"
        ? ClassProp
        : IsEventHandler<K, T[K]> extends true
          ? CxEventHandler<T[K]>
          : string extends T[K]
            ? Prop<T[K]> // Plain string props - no change needed
            : NonNullable<T[K]> extends string
              ? Prop<T[K]> | string // String literal unions - accept string for JSX compatibility
              : Prop<T[K]>;
};

/** Base HtmlElement configuration - core CxJS properties for extension by widgets */
export interface HtmlElementConfigBase extends StyledContainerConfig {
   id?: StringProp | NumberProp;

   /** HTML tag name */
   tag?: string;

   /** Inner text contents. */
   text?: StringProp | NumberProp;

   /** Inner html contents. */
   innerHtml?: StringProp;

   /** Inner html contents. */
   html?: StringProp;

   /** Tooltip configuration. */
   tooltip?: StringProp | TooltipConfig;

   /** Additional attributes to be applied. */
   attrs?: StructuredProp;

   /** Additional data attributes. */
   data?: StructuredProp;

   //** Set to true to automatically focus the element when mounted. */
   autoFocus?: BooleanProp;

   //** Callback to receive the HTMLElement where this component is mounted. */
   onRef?: string | ((element: HTMLElement | null, instance: Instance) => void);
}

/** HtmlElement configuration with tag-specific attributes and events */
export type HtmlElementConfig<Tag extends keyof ReactIntrinsicElements = "div"> = Omit<
   HtmlElementConfigBase,
   "tag"
> &
   CxTransformProps<ReactIntrinsicElements[Tag]> & { tag?: Tag };

export class HtmlElementInstance<E extends HtmlElement<any, any> = HtmlElement<any, any>>
   extends Instance<E>
   implements TooltipParentInstance
{
   events?: Record<string, (e: React.SyntheticEvent, instance: Instance) => any>;
   declare tooltips: { [key: string]: TooltipInstance };
}

export class HtmlElement<
   Config extends HtmlElementConfigBase = HtmlElementConfig,
   InstanceType extends HtmlElementInstance<any> = HtmlElementInstance<any>,
> extends StyledContainerBase<Config, InstanceType> {
   declare public tag?: string;
   declare public html?: string;
   declare public innerText?: string;
   declare public text?: string;
   declare public innerHtml?: string;
   declare public attrs?: Record<string, unknown>;
   declare public data?: Record<string, unknown>;
   declare public events?: Record<string, (e: Event, instance: Instance) => unknown>;
   declare public urlAttributes?: string[];
   declare public extraProps?: Record<string, unknown>;
   declare public tooltip?: TooltipProp;
   declare public onRef?: string | ((element: HTMLElement | null, instance: Instance) => void);
   declare public autoFocus?: boolean | string;
   [key: string]: unknown; // Index signature for dynamic properties

   constructor(config?: Config) {
      super(config);

      if (isUndefined(this.jsxAttributes) && config)
         this.jsxAttributes = Object.keys(config).filter(this.isValidHtmlAttribute.bind(this));
   }

   declareData(...args: Record<string, unknown>[]): void {
      const data: Record<string, unknown> = {
         text: undefined,
         innerHtml: undefined,
         attrs: {
            structured: true,
         },
         data: {
            structured: true,
         },
         autoFocus: undefined,
      };

      let name: string | false;

      this.urlAttributes = [];

      if (this.jsxAttributes) {
         this.jsxAttributes.forEach((attr) => {
            if (urlAttributes[`${this.tag}.${attr}`]) this.urlAttributes!.push(attr);

            if ((name = isDataAttribute(attr))) {
               if (!this.data) this.data = {};
               this.data[name] = this[attr];
            } else if ((name = this.isValidHtmlAttribute(attr)) && !data.hasOwnProperty(name)) {
               if (name.indexOf("on") === 0) {
                  if (this[attr]) {
                     if (!this.events) this.events = {};
                     this.events[name] = this[attr] as (e: Event, instance: Instance) => unknown;
                  }
               } else {
                  if (!this.attrs) this.attrs = {};
                  this.attrs[name] = this[attr];
               }
            }
         });
      }

      if (this.urlAttributes.length === 0) delete this.urlAttributes;

      // Combine args array with data object for super call
      super.declareData(...args, data);
   }

   isValidHtmlAttribute(attrName: string): string | false {
      switch (attrName) {
         case "tag":
         case "type":
         case "$type":
         case "$props":
         case "text":
         case "layout":
         case "class":
         case "className":
         case "style":
         case "controller":
         case "outerLayout":
         case "items":
         case "children":
         case "visible":
         case "if":
         case "mod":
         case "putInto":
         case "contentFor":
         case "trimWhitespace":
         case "preserveWhitespace":
         case "ws":
         case "plainText":
         case "vertical":
         case "memoize":
         case "onInit":
         case "onExplore":
         case "onDestroy":
         case "onRef":
         case "html":
         case "innerText":
         case "baseClass":
         case "CSS":
         case "tooltip":
         case "styles":
         case "jsxAttributes":
         case "jsxSpread":
         case "instance":
         case "store":
         case "autoFocus":
         case "vdomKey":
            return false;

         default:
            if (isDataAttribute(attrName)) return false;
            break;
      }

      return attrName;
   }

   init(): void {
      if (this.html) this.innerHtml = this.html;

      if (this.innerText) this.text = this.innerText;

      super.init();
   }

   prepareData(context: RenderingContext, instance: InstanceType): void {
      const { data } = instance;
      if (this.urlAttributes && data.attrs) {
         data.attrs = { ...data.attrs };
         this.urlAttributes.forEach((attr: string) => {
            const attrValue = (data.attrs as Record<string, unknown>)[attr];
            if (isString(attrValue)) {
               (data.attrs as Record<string, unknown>)[attr] = Url.resolve(attrValue);
            }
         });
      }
      super.prepareData(context, instance);
   }

   attachProps(context: RenderingContext, instance: InstanceType, props: RenderProps): void {
      Object.assign(props, this.extraProps);

      if (!isString(this.tag)) props.instance = instance;
   }

   render(context: RenderingContext, instance: InstanceType, key: string): React.ReactNode {
      //rebind events to pass instance
      if (this.events && !instance.events) {
         instance.events = {};
         for (const eventName in this.events) {
            const handler = this.events[eventName];
            instance.events[eventName] = (e: React.SyntheticEvent) => instance.invoke(eventName, e, instance);
         }
      }

      const { data, events } = instance;

      const props: RenderProps = Object.assign(
         {
            key: key,
         },
         data.attrs,
         events,
      );

      if (data.classNames) props.className = data.classNames as string;

      if (data.style) props.style = data.style as Record<string, string | number>;

      let children: CxChild;
      if (isDefined(data.text)) children = data.text;
      else if (isString(data.innerHtml)) {
         props.dangerouslySetInnerHTML = { __html: data.innerHtml };
      } else {
         children = this.renderChildren(context, instance);
         if (children && isArray(children) && children.length === 0) children = undefined;
      }

      props.children = children;

      this.attachProps(context, instance, props);

      if (this.tooltip || this.onRef || this.autoFocus)
         return (
            <ContainerComponent key={key} tag={this.tag!} props={props} instance={instance} data={data}>
               {props.children as React.ReactNode}
            </ContainerComponent>
         );

      return VDOM.createElement(this.tag!, props, props.children as React.ReactNode);
   }
}

HtmlElement.prototype.tag = "div";

interface ContainerComponentProps {
   tag: string | React.ComponentType;
   props: RenderProps;
   children: React.ReactNode;
   instance: HtmlElementInstance;
   data: WidgetData;
   key: string;
}

class ContainerComponent extends VDOM.Component<ContainerComponentProps> {
   el: HTMLElement | null = null;
   declare ref: (c: HTMLElement | null) => void;

   constructor(props: ContainerComponentProps) {
      super(props);
      this.ref = (c: HTMLElement | null) => {
         this.el = c;
         const { instance } = this.props;
         const widget = instance.widget as HtmlElement;
         if (widget.onRef) {
            instance.invoke("onRef", c, instance);
         }
      };
   }

   render(): React.ReactNode {
      const { tag, props, children, instance } = this.props;
      const widget = instance.widget as HtmlElement;

      props.ref = this.ref;

      if (widget.tooltip) {
         const { onMouseLeave, onMouseMove } = props;

         props.onMouseLeave = (e: React.MouseEvent) => {
            tooltipMouseLeave(e, instance, widget.tooltip!);
            if (onMouseLeave) onMouseLeave(e);
         };
         props.onMouseMove = (e: React.MouseEvent) => {
            tooltipMouseMove(e, instance, widget.tooltip!);
            if (onMouseMove) onMouseMove(e);
         };
      }

      return VDOM.createElement(tag, props, children);
   }

   componentWillUnmount(): void {
      tooltipParentWillUnmount(this.props.instance);
   }

   UNSAFE_componentWillReceiveProps(props: ContainerComponentProps): void {
      const widget = this.props.instance.widget as HtmlElement;
      if (this.el && widget.tooltip) {
         tooltipParentWillReceiveProps(this.el, props.instance, widget.tooltip);
      }
   }

   componentDidMount(): void {
      const widget = this.props.instance.widget as HtmlElement;
      if (this.el && widget.tooltip) {
         tooltipParentDidMount(this.el, this.props.instance, widget.tooltip);
      }
      autoFocus(this.el, this);
   }

   componentDidUpdate(): void {
      const widget = this.props.instance.widget as HtmlElement;
      if (this.el && widget.tooltip) {
         tooltipParentDidUpdate(this.el, this.props.instance, widget.tooltip);
      }
      autoFocus(this.el, this);
   }
}

const originalWidgetFactory = Widget.factory;

//support for React components
Widget.factory = function (
   type: string | React.ComponentType | undefined,
   config?: Record<string, unknown>,
   more?: Record<string, unknown>,
) {
   const typeType = typeof type;

   if (typeType === "undefined") {
      debug("Creating a widget of unknown type.", config, more);
      return new HtmlElement(Object.assign({}, config, more));
   }

   if (typeType === "function") return HtmlElement.create(HtmlElement, { tag: type }, config);

   return originalWidgetFactory.call(Widget, type as string, config, more);
};

Widget.alias("html-element", HtmlElement);
