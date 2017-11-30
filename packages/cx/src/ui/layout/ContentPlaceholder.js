import {Widget} from '../Widget';
import {PureContainer} from '../PureContainer';

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
      if (instance.content && instance.content.shouldUpdate)
         instance.markShouldUpdate(context);
   }

   setContent(context, instance, content) {
      instance.content = content;
      content.contentPlaceholder = instance;

      if (instance.cache('content', content) || content.shouldUpdate)
         instance.markShouldUpdate(context);
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