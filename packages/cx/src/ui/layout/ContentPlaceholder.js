import { Widget } from "../Widget";
import { PureContainer } from "../PureContainer";
import { isString } from "../../util/isString";

export class ContentPlaceholder extends PureContainer {
   declareData() {
      super.declareData(...arguments, {
         name: undefined,
      });
   }

   explore(context, instance) {
      instance.content = null;
      let { data } = instance;

      const content = context.content && context.content[data.name];
      if (content && !this.scoped) this.setContent(context, instance, content);
      else
         context.pushNamedValue("contentPlaceholder", data.name, (content) => {
            this.setContent(context, instance, content);
         });

      if (this.scoped)
         instance.unregisterContentPlaceholder = () => {
            context.popNamedValue("contentPlaceholder", data.name);
         };

      super.explore(context, instance);
   }

   prepare(context, instance) {
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

   setContent(context, instance, content) {
      if (this.allowMultiple) {
         if (instance.content == null) instance.content = [];
         instance.content.push(content);
      } else instance.content = content;
      content.contentPlaceholder = instance;
   }

   render(context, instance, key) {
      const { content } = instance;
      if (!content) return super.render(context, instance, key);
      if (this.allowMultiple) return content.map((x) => x.contentVDOM);
      return content.contentVDOM;
   }
}

ContentPlaceholder.prototype.name = "body";
ContentPlaceholder.prototype.scoped = false;
ContentPlaceholder.prototype.allowMultiple = false;

Widget.alias("content-placeholder", ContentPlaceholder);

export class ContentPlaceholderScope extends PureContainer {
   init() {
      super.init();

      if (isString(this.name)) this.name = [this.name];
   }

   explore(context, instance) {
      this.name.forEach((name) => {
         context.pushNamedValue("contentPlaceholder", name, null);
         context.pushNamedValue("content", name, null);
      });
      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      this.name.forEach((name) => {
         context.popNamedValue("contentPlaceholder", name);
         context.popNamedValue("content", name);
      });
   }
}
