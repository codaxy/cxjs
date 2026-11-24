/** @jsxImportSource react */
import { Widget, VDOM, getContent } from "../ui/Widget";
import { ChildNode, ContainerBase, StyledContainerConfig } from "../ui/Container";
import { Heading } from "./Heading";
import { isString } from "../util/isString";
import { parseStyle } from "../util/parseStyle";
import { RenderingContext } from "../ui/RenderingContext";
import { Instance } from "../ui/Instance";
import { BooleanProp, StringProp, StyleProp, ClassProp, Prop } from "../ui/Prop";
import { Create } from "../util/Component";
import { ContentPlaceholder, ContentPlaceholderInstance } from "../ui/layout/ContentPlaceholder";

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

   /**
    * Contents that should go in the header. Without a header or a title, content with `putInto="header"` anywhere
    * inside the section is shown in the header.
    */
   header?: Create<typeof Widget>;

   /**
    * Contents that should go in the footer. Without a footer, content with `putInto="footer"` anywhere inside the
    * section is shown in the footer.
    */
   footer?: Create<typeof Widget>;

   /** Title heading level (1-6) */
   hLevel?: number;
}

export class Section extends ContainerBase<SectionConfig, Instance> {
   declare headerStyle?: StyleProp;
   declare footerStyle?: StyleProp;
   declare bodyStyle?: StyleProp;
   declare title?: StringProp;
   declare header?: Create<typeof Widget>;
   declare footer?: Create<typeof Widget>;
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
      // without a header or a footer, the section collects nested content put into them, as Window does; the
      // placeholders are scoped, so they take only content from inside the section
      super.initComponents(context, instance, {
         header: this.getHeader() ?? ContentPlaceholder.create({ name: "header", scoped: true }),
         footer: this.getFooter() ?? ContentPlaceholder.create({ name: "footer", scoped: true }),
      });
   }

   exploreCleanup(context: RenderingContext, instance: Instance): void {
      super.exploreCleanup?.(context, instance);
      (instance.components?.header as ContentPlaceholderInstance)?.unregisterContentPlaceholder?.();
      (instance.components?.footer as ContentPlaceholderInstance)?.unregisterContentPlaceholder?.();
   }

   getHeader(): Widget | null {
      if (this.title)
         return Widget.create(Heading, {
            text: this.title,
            level: this.hLevel,
         }) as Widget;

      if (this.header) return Heading.create(this.header);

      return null;
   }

   getFooter(): Widget | null {
      if (this.footer) return Widget.create(this.footer);

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

      // the header and the footer are rendered only if they have content, e.g. if something is put into them
      let headerContent = components?.header && getContent(components.header.render(context));
      if (headerContent != null) {
         header = (
            <header
               className={CSS.expand(CSS.element(baseClass, "header"), data.headerClass)}
               style={data.headerStyle as any}
            >
               {headerContent}
            </header>
         );
      }

      let footerContent = components?.footer && getContent(components.footer.render(context));
      if (footerContent != null) {
         footer = (
            <footer
               className={CSS.expand(CSS.element(baseClass, "footer"), data.footerClass)}
               style={data.footerStyle as any}
            >
               {footerContent}
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
            <div
               className={CSS.expand(CSS.element(this.baseClass, "body"), data.bodyClass)}
               style={data.bodyStyle as any}
            >
               {this.renderChildren(context, instance)}
            </div>
            {footer}
         </section>
      );
   }
}

Section.prototype.styled = true;
Section.prototype.pad = true;
Section.prototype.baseClass = "section";
Section.prototype.hLevel = 3;
