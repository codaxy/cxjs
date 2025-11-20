/** @jsxImportSource react */
import { Widget, VDOM, getContent } from "../ui/Widget";
import { ContainerBase, StyledContainerConfig } from "../ui/Container";
import { Heading } from "./Heading";
import { isString } from "../util/isString";
import { parseStyle } from "../util/parseStyle";
import { RenderingContext } from "../ui/RenderingContext";
import { Instance } from "../ui/Instance";
import { BooleanProp, StringProp, StyleProp, ClassProp, Prop } from "../ui/Prop";

export interface SectionConfig extends StyledContainerConfig {
   id?: Prop<string | number>;

   /** Add default padding to the section body. Default is `true`. */
   pad?: BooleanProp;

   /** A custom style which will be applied to the header. */
   headerStyle?: StyleProp;

   /** Additional CSS class to be applied to the header. */
   headerClass?: ClassProp;

   /** A custom style which will be applied to the body. */
   bodyStyle?: StyleProp;

   /** Additional CSS class to be applied to the section body. */
   bodyClass?: ClassProp;

   /** A custom style which will be applied to the footer. */
   footerStyle?: StyleProp;

   /** Additional CSS class to be applied to the footer. */
   footerClass?: ClassProp;

   /** Section's title. */
   title?: StringProp;

   /** Contents that should go in the header. */
   header?: Record<string, unknown>;

   /** Contents that should go in the footer. */
   footer?: Record<string, unknown>;

   /** Title heading level (1-6) */
   hLevel?: number;
}

export class Section extends ContainerBase<SectionConfig, Instance> {
   declare headerStyle?: StyleProp;
   declare footerStyle?: StyleProp;
   declare bodyStyle?: StyleProp;
   declare title?: StringProp;
   declare header?: Record<string, unknown>;
   declare footer?: Record<string, unknown>;
   declare hLevel?: number;
   declare pad?: BooleanProp;
   declare baseClass: string;

   init(): void {
      if (isString(this.headerStyle)) this.headerStyle = parseStyle(this.headerStyle);

      if (isString(this.footerStyle)) this.footerStyle = parseStyle(this.footerStyle);

      if (isString(this.bodyStyle)) this.bodyStyle = parseStyle(this.bodyStyle);

      super.init();
   }

   add(item: any): void {
      if (item && item.putInto == "header")
         this.header = {
            ...item,
            putInto: null,
         };
      else if (item && item.putInto == "footer")
         this.footer = {
            ...item,
            putInto: null,
         };
      else super.add(item);
   }

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(...args, {
         id: undefined,
         headerStyle: { structured: true },
         headerClass: { structured: true },
         bodyStyle: { structured: true },
         bodyClass: { structured: true },
         footerStyle: { structured: true },
         footerClass: { structured: true },
      });
   }

   initComponents(context: RenderingContext, instance: Instance): void {
      super.initComponents(context, instance, {
         header: this.getHeader(),
         footer: this.getFooter(),
      });
   }

   getHeader(): Widget | null {
      if (this.title)
         return Widget.create(Heading, {
            text: this.title,
            level: this.hLevel,
         }) as Widget;

      if (this.header) return Heading.create(this.header) as Widget;

      return null;
   }

   getFooter(): Widget | null {
      if (this.footer) return Widget.create(this.footer) as Widget;

      return null;
   }

   prepareData(context: RenderingContext, instance: Instance): void {
      let { data } = instance;
      data.stateMods = {
         ...data.stateMods,
         pad: this.pad,
      };
      super.prepareData(context, instance);
   }

   initInstance(context: RenderingContext, instance: Instance): void {
      (instance as any).eventHandlers = instance.getJsxEventProps();
      super.initInstance(context, instance);
   }

   render(context: RenderingContext, instance: Instance, key: string): React.ReactNode {
      let { data, components } = instance;
      let eventHandlers = (instance as any).eventHandlers;
      let header: React.ReactNode, footer: React.ReactNode;
      let { CSS, baseClass } = this;

      if (components?.header) {
         header = (
            <header
               className={CSS.expand(CSS.element(baseClass, "header"), data.headerClass)}
               style={data.headerStyle as any}
            >
               {getContent(components.header.render(context))}
            </header>
         );
      }

      if (components?.footer) {
         footer = (
            <footer
               className={CSS.expand(CSS.element(baseClass, "footer"), data.footerClass)}
               style={data.footerStyle as any}
            >
               {getContent(components.footer.render(context))}
            </footer>
         );
      }

      return (
         <section
            key={key}
            className={data.classNames as string}
            style={data.style as any}
            id={data.id as string}
            {...eventHandlers}
         >
            {header}
            <div className={CSS.expand(CSS.element(this.baseClass, "body"), data.bodyClass)} style={data.bodyStyle as any}>
               {this.renderChildren(context, instance)}
            </div>
            {footer}
         </section>
      );
   }
}


Section.prototype.styled = true;
Section.prototype.pad = true;
Section.prototype.baseClass = 'section';
Section.prototype.hLevel = 3;
