import { contentAppend, Widget, WidgetConfig } from "./Widget";
import { StaticText } from "./StaticText";
import { Text } from "./Text";
import { innerTextTrim } from "../util/innerTextTrim";
import { isString } from "../util/isString";
import { isArray } from "../util/isArray";
import { exploreChildren } from "./layout/exploreChildren";
import { Instance } from "./Instance";
import { CxChild, RenderingContext } from "./RenderingContext";
import { ClassProp, ModProp, StyleProp } from "./Prop";

export interface ContainerConfig extends WidgetConfig {
   /** Keep whitespace in text based children. Default is `false`. See also `trimWhitespace`. */
   ws?: boolean;

   /** Remove all whitespace in text based children. Default is `true`. See also `preserveWhitespace`. */
   trimWhitespace?: boolean;

   /** Keep whitespace in text based children. Default is `false`. See also `trimWhitespace`. */
   preserveWhitespace?: boolean;

   /** List of child elements. */
   items?: any;

   /** List of child elements. */
   children?: any;

   plainText?: boolean;
}

export interface StyledContainerConfig extends ContainerConfig {
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

   /** Style object applied to the element */
   style?: StyleProp;

   /** Style object applied to the element */
   styles?: StyleProp;

   /** Base CSS class to be applied to the element. For example, value 'button' will add a class 'cxb-button' to the element. */
   baseClass?: string;

   /** Appearance modifier. For example, mod="big" will add the CSS class .cxm-big to the block element. */
   mod?: ModProp;
}

// Base class for extending with custom Config types
export class ContainerBase<
   Config extends ContainerConfig = ContainerConfig,
   InstanceType extends Instance = Instance,
> extends Widget<Config, InstanceType> {
   public ws?: boolean;
   public preserveWhitespace?: boolean;
   public trimWhitespace?: boolean;
   declare public items: Widget[];
   public children?: Widget[];
   public layout?: Container | null;
   public useParentLayout?: boolean;
   public itemDefaults?: any;
   public plainText?: boolean;

   public init(context?: any): void {
      super.init();
      if (typeof this.ws !== "undefined") this.preserveWhitespace = this.ws;

      if (this.preserveWhitespace) this.trimWhitespace = false;

      let items = this.items || this.children || [];
      delete this.children;
      this.items = [];

      if (this.layout) {
         let layout = Container.create({ type: this.layout, items }, {});
         layout.init(context);
         this.layout = null;
         if ("noLayout" in layout && (layout as any).noLayout) {
            this.useParentLayout = true;
            this.add(items);
         } else {
            this.add(layout);
            this.layout = layout;
         }
      } else {
         this.add(items);
      }
   }

   protected exploreItems(context: RenderingContext, instance: Instance, items: CxChild[]): void {
      instance.children = exploreChildren(context, instance, items, instance.cached.children, null, instance.store);
      if (instance.cache("children", instance.children)) instance.markShouldUpdate(context);
   }

   public explore(context: any, instance: any): void {
      super.explore(context, instance);
      this.exploreItems(context, instance, this.items!);
   }

   public render(context: any, instance: any, key: any): any {
      return this.renderChildren(context, instance, key);
   }

   protected renderChildren(_context: any, instance: any, key?: string): any {
      let preserveComplexContent = this.useParentLayout;

      function append(result: any[], r: any): void {
         if (r == null) return;

         //react element
         if (!r.hasOwnProperty("content")) {
            contentAppend(result, r);
            return;
         }

         if (r.useParentLayout) return r.content.forEach((x: any) => append(result, x));

         if (r.atomic || preserveComplexContent) {
            result.push(r);
         } else {
            let first = true;
            for (let k in r) if (contentAppend(result, r[k], !first)) first = false;
         }
      }

      let result: React.ReactNode[] = [];
      for (let i = 0; i < instance.children.length; i++) {
         append(result, instance.children[i].vdom);
      }

      if (this.useParentLayout)
         return {
            useParentLayout: true,
            content: result,
         };

      return result;
   }

   public clear(): void {
      if (this.layout) this.layout.clear();
      else this.items = [];
   }

   // Overload create to return Container type instead of any
   public static create(typeAlias?: any, config?: any, more?: any): Container {
      return super.create(typeAlias, config, more) as Container;
   }

   public add(...args: any[]): void {
      if (this.layout) return this.layout.add(...args);
      for (let a of args) {
         if (!a) return;
         if (isArray(a)) {
            for (let c of a) this.add(c);
         } else if (isString(a)) {
            if (this.trimWhitespace) a = innerTextTrim(a);
            if (a) this.addText(a);
         } else if (a.isComponent) this.items.push(this.wrapItem(a));
         else {
            this.add(Widget.create(a, this.itemDefaults, {}));
         }
      }
   }

   protected wrapItem(item: any): any {
      return item;
   }

   protected addText(text: string): void {
      if (this.plainText || text.indexOf("{") == -1 || text.indexOf("}") == -1)
         this.add(Widget.create(StaticText, { text: text }, {}));
      else this.add(Widget.create(Text, { text: { tpl: text } }, {}));
   }

   public find(filter: any, options?: any): any[] {
      if (!options) options = {};

      if (!filter || !this.items) return [];

      let alias = filter;

      if (isString(filter)) filter = (w: any) => w.componentAlias == alias;

      if (filter.isComponentType) filter = (w: any) => w instanceof alias;

      let results = [];

      for (let i = 0; i < this.items.length; i++) {
         let w = this.items[i];

         if (w && !w.initialized) w.init();

         if (filter(w)) {
            results.push(w);
            if (options.first) break;
         }

         if (w && (w as any).find) results.push(...(w as any).find(filter, options));
      }

      return results;
   }

   public findFirst(filter: any, options?: any): any {
      return this.find(filter, { ...options, first: true })[0];
   }
}

ContainerBase.prototype.trimWhitespace = true;
ContainerBase.prototype.plainText = true;
ContainerBase.prototype.styled = false;

// Closed type for direct usage - preserves ControllerProp ThisType
export class Container extends ContainerBase<ContainerConfig, Instance> {}
