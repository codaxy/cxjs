import {Widget} from '../Widget';
import {PureContainer} from '../PureContainer';
import {isString} from "../../util/isString";

export class ContentPlaceholder extends PureContainer {

   declareData() {
      super.declareData(...arguments, {
         name: undefined
      });
   }

   explore(context, instance) {
      instance.content = null;
      let {data} = instance;

      const content = context.content && context.content[data.name];
      if (content && !this.scoped)
         this.setContent(context, instance, content);
      else
         context.pushNamedValue('contentPlaceholder', data.name, (content) => {
            this.setContent(context, instance, content);
         });

      if (this.scoped)
         instance.unregisterContentPlaceholder = () => {
            context.popNamedValue("contentPlaceholder", data.name);
         };

      super.explore(context, instance);
   }

   prepare(context, instance) {
      let {content} = instance;
      if (instance.cache('content', content) || (content && content.shouldUpdate))
         instance.markShouldUpdate(context);
   }

   setContent(context, instance, content) {
      instance.content = content;
      content.contentPlaceholder = instance;
   }

   render(context, instance, key) {
      const {content} = instance;
      if (content)
         return content.contentVDOM;

      return super.render(context, instance, key);
   }
}

ContentPlaceholder.prototype.name = 'body';
ContentPlaceholder.prototype.scoped = false;

Widget.alias('content-placeholder', ContentPlaceholder);

export class ContentPlaceholderScope extends PureContainer {
   init() {
      super.init();

      if (isString(this.name))
         this.name = [this.name];
   }

   explore(context, instance) {
      this.name.forEach(name => {
         context.pushNamedValue('contentPlaceholder', name, null);
         context.pushNamedValue('content', name, null);
      });
      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      this.name.forEach(name => {
         context.popNamedValue('contentPlaceholder', name);
         context.popNamedValue('content', name);
      });
   }
}