import { Widget, WidgetConfig } from "../ui/Widget";
import { RenderingContext } from "../ui/RenderingContext";
import { Instance } from "../ui/Instance";
import { StringProp } from "../ui/Prop";

export interface DocumentTitleConfig extends WidgetConfig {
   /** Text value to be used for the document title. */
   value?: StringProp;

   /** Text value to be used for the document title. */
   text?: StringProp;

   /** Deprecated. Use `action: "append"` instead. */
   append?: boolean;

   /** How to combine the title with existing document title. Default is `append`. */
   action?: "append" | "replace" | "prepend";

   /** Separator used when appending or prepending to the title. Default is empty string. */
   separator?: StringProp;
}

export class DocumentTitle extends Widget<DocumentTitleConfig> {
   declare value?: StringProp;
   declare text?: StringProp;
   declare append?: boolean;
   declare action?: "append" | "replace" | "prepend";
   declare separator?: StringProp;

   constructor(config?: DocumentTitleConfig) {
      super(config);
   }

   init(): void {
      if (this.value) this.text = this.value;

      if (this.append) this.action = "append";

      super.init();
   }

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(...args, {
         value: undefined,
         text: undefined,
         action: undefined,
         separator: undefined,
      });
   }

   explore(context: RenderingContext, instance: Instance): void {
      if (!(context as any).documentTitle) {
         (context as any).documentTitle = {
            activeInstance: instance,
            title: "",
         };
      }

      let { data } = instance;

      if (data.text) {
         switch (data.action) {
            case "append":
               if ((context as any).documentTitle.title) (context as any).documentTitle.title += data.separator;
               (context as any).documentTitle.title += data.text;
               break;

            case "prepend":
               (context as any).documentTitle.title = data.text + data.separator + (context as any).documentTitle.title;
               break;

            default:
            case "replace":
               (context as any).documentTitle.title = data.text;
               break;
         }
      }

      super.explore(context, instance);
   }

   prepare(context: RenderingContext, instance: Instance): void {
      if ((context as any).documentTitle.activeInstance == instance)
         document.title = (context as any).documentTitle.title;
   }

   render(): null {
      return null;
   }
}

DocumentTitle.prototype.action = "append";
DocumentTitle.prototype.separator = "";

Widget.alias("document-title", DocumentTitle);
