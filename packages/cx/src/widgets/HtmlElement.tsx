import { Widget, VDOM } from "../ui/Widget";
import { Container } from "../ui/Container";
import {
   tooltipMouseMove,
   tooltipParentWillUnmount,
   tooltipMouseLeave,
   tooltipParentWillReceiveProps,
   tooltipParentDidMount,
   tooltipParentDidUpdate,
} from "./overlay/tooltip-ops";
import { Url } from "../ui/app/Url";
import { debug } from "../util/Debug";
import { isString } from "../util/isString";
import { isUndefined } from "../util/isUndefined";
import { isDefined } from "../util/isDefined";
import { isArray } from "../util/isArray";
import { autoFocus } from "./autoFocus";
import type { RenderingContext } from "../ui/RenderingContext";
import type { WidgetData, WidgetInstance, RenderProps, Instance } from "../ui/Instance";
import type { TooltipConfig } from "./overlay/tooltip-ops";

const isDataAttribute = (attr: string): string | false =>
   attr.indexOf("data-") === 0 ? attr.substring(5) : false;

export let urlAttributes: Record<string, boolean> = {
   "a.href": true,
   "img.src": true,
   "iframe.src": true,
};

export class HtmlElement extends Container {
   public tag?: string;
   public html?: string;
   public innerText?: string;
   public text?: string;
   public innerHtml?: string;
   public attrs?: Record<string, unknown>;
   public data?: Record<string, unknown>;
   public events?: Record<string, (e: Event, instance: Instance) => unknown>;
   public urlAttributes?: string[];
   public extraProps?: Record<string, unknown>;
   public tooltip?: TooltipConfig;
   public onRef?: (element: HTMLElement | null, instance: Instance) => void;
   public autoFocus?: boolean | string;
   [key: string]: unknown; // Index signature for dynamic properties

   constructor(config?: Record<string, unknown>) {
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
      super.declareData(...[...args, data]);
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

   prepareData(context: RenderingContext, instance: Instance): void {
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

   attachProps(context: RenderingContext, instance: Instance, props: RenderProps): void {
      Object.assign(props, this.extraProps);

      if (!isString(this.tag)) props.instance = instance;
   }

   render(context: RenderingContext, instance: Instance, key: string | number): React.ReactNode {
      //rebind events to pass instance
      if (this.events && !instance.events) {
         instance.events = {};
         for (const eventName in this.events) {
            const handler = this.events[eventName];
            instance.events[eventName] = (e: Event) => instance.invoke(eventName, e, instance);
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

      let children: React.ReactNode;
      if (isDefined(data.text)) children = data.text as React.ReactNode;
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
               {props.children}
            </ContainerComponent>
         );

      return VDOM.createElement(this.tag!, props, props.children);
   }
}

HtmlElement.prototype.tag = "div";
HtmlElement.prototype.styled = true;

interface ContainerComponentProps {
   tag: string | React.ComponentType;
   props: RenderProps;
   children: React.ReactNode;
   instance: Instance;
   data: WidgetData;
   key: string | number;
}

class ContainerComponent extends VDOM.Component<ContainerComponentProps> {
   el: HTMLElement | null = null;
   ref: (c: HTMLElement | null) => void;

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
            tooltipMouseLeave(e.nativeEvent, instance, widget.tooltip!);
            if (onMouseLeave) onMouseLeave(e);
         };
         props.onMouseMove = (e: React.MouseEvent) => {
            tooltipMouseMove(e.nativeEvent, instance, widget.tooltip!);
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
   more?: Record<string, unknown>
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
