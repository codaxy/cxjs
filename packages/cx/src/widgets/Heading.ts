import { HtmlElement, HtmlElementConfigBase, HtmlElementInstance } from "./HtmlElement";
import { RenderingContext } from "../ui/RenderingContext";

export interface HeadingConfig extends HtmlElementConfigBase {
   /** Name of the HTML element to be rendered. Default is `div`. */
   tag?: string;

   /** Heading level. Allowed values go from 1 to 6. Default is 3. */
   level?: number | string;

   /** Base CSS class. Default is `heading`. */
   baseClass?: string;
}

export class Heading extends HtmlElement<HeadingConfig, HtmlElementInstance> {
   declare level?: number | string;

   init(): void {
      this.tag = `h${this.level}`;
      super.init();
   }

   prepareData(context: RenderingContext, instance: HtmlElementInstance): void {
      let { data } = instance;
      data.stateMods = {
         ...data.stateMods,
         [`level-${this.level}`]: true,
      };
      super.prepareData(context, instance);
   }

   isValidHtmlAttribute(attrName: string): string | false {
      switch (attrName) {
         case "level":
            return false;

         default: return super.isValidHtmlAttribute(attrName);
      }
   }
}

Heading.prototype.level = 3;
Heading.prototype.baseClass = "heading";