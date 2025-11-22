import { isNonEmptyArray } from "../../util/isNonEmptyArray";
import { isString } from "../../util/isString";
import { PureContainerBase, PureContainerConfig } from "../PureContainer";
import { RenderingContext } from "../RenderingContext";
import { Widget } from "../Widget";
import { StringProp } from "../Prop";
import { Instance } from "../Instance";

export interface ContentPlaceholderConfig extends PureContainerConfig {
   name?: StringProp;
   scoped?: boolean;
   /** Set to true to allow all registered content elements to render inside the placeholder. Otherwise only one element is rendered. */
   allowMultiple?: boolean;
}

export class ContentPlaceholderInstance extends Instance<ContentPlaceholder> {
   declare content?: any;
   unregisterContentPlaceholder?: () => void;
}

export class ContentPlaceholder extends PureContainerBase<ContentPlaceholderConfig, ContentPlaceholderInstance> {
   declare name?: string;
   declare scoped?: boolean;
   declare allowMultiple?: boolean;

   declareData(...args: any[]): void {
      super.declareData(...args, {
         name: undefined,
      });
   }

   explore(context: RenderingContext, instance: ContentPlaceholderInstance): void {
      instance.content = null;
      let { data } = instance;

      if (this.allowMultiple) {
         const contentList = (context as any).contentList && (context as any).contentList[data.name];
         if (isNonEmptyArray(contentList) && !this.scoped)
            for (let i = 0; i < contentList.length; i++) this.setContent(context, instance, contentList[i]);

         // in multi mode register a callback to allow for more entries to be added
         (context as any).pushNamedValue("contentPlaceholder", data.name, (content: any) => {
            this.setContent(context, instance, content);
         });
      } else {
         const content = (context as any).content && (context as any).content[data.name];
         if (content && !this.scoped) this.setContent(context, instance, content);
         else
            (context as any).pushNamedValue("contentPlaceholder", data.name, (content: any) => {
               this.setContent(context, instance, content);
            });
      }

      if (this.scoped)
         instance.unregisterContentPlaceholder = () => {
            (context as any).popNamedValue("contentPlaceholder", data.name);
         };

      super.explore(context, instance);
   }

   prepare(context: RenderingContext, instance: ContentPlaceholderInstance): void {
      let { content } = instance;
      if (this.allowMultiple) {
         let contentId = "";
         let shouldUpdate = false;
         if (content) {
            for (let i = 0; i < content.length; i++) {
               let c = content[i];
               contentId += c.id + "+";
               shouldUpdate = shouldUpdate || c.shouldUpdate;
            }
         }
         if (instance.cache("content", contentId) || shouldUpdate) instance.markShouldUpdate(context);
      } else if (instance.cache("content", content) || (content && content.shouldUpdate))
         instance.markShouldUpdate(context);
   }

   setContent(context: RenderingContext, instance: ContentPlaceholderInstance, content: any): void {
      if (this.allowMultiple) {
         if (instance.content == null) instance.content = [];
         instance.content.push(content);
      } else instance.content = content;
      content.contentPlaceholder = instance;
   }

   render(context: RenderingContext, instance: ContentPlaceholderInstance, key: any): any {
      const { content } = instance;
      if (!content) return super.render(context, instance, key);
      if (this.allowMultiple) return content.map((x: any) => x.contentVDOM);
      return content.contentVDOM;
   }
}

ContentPlaceholder.prototype.name = "body";
ContentPlaceholder.prototype.scoped = false;
ContentPlaceholder.prototype.allowMultiple = false;

Widget.alias("content-placeholder", ContentPlaceholder);

export interface ContentPlaceholderScopeConfig extends PureContainerConfig {
   name: string | string[];
}

export class ContentPlaceholderScope extends PureContainerBase<ContentPlaceholderScopeConfig> {
   declare name: string[];

   init(): void {
      super.init();
      if (isString(this.name)) this.name = [this.name];
   }

   explore(context: RenderingContext, instance: any): void {
      this.name.forEach((name) => {
         context.pushNamedValue("contentPlaceholder", name, null);
         context.pushNamedValue("content", name, null);
         context.pushNamedValue("contentList", name, []);
      });
      super.explore(context, instance);
   }

   exploreCleanup(context: RenderingContext, instance: any): void {
      this.name.forEach((name) => {
         context.popNamedValue("contentPlaceholder", name);
         context.popNamedValue("content", name);
         context.popNamedValue("contentList", name);
      });
   }
}
