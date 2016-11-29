import {Widget} from '../Widget';
import {PureContainer} from '../PureContainer';

export class ContentPlaceholder extends PureContainer {

   declareData() {
      super.declareData(...arguments, {
         name: undefined
      });
   }

   explore(context, instance, data) {
      instance.content = null;
      const content = context.content && context.content[data.name];
      if (content)
         this.setContent(context, instance, content);
      else {
         if (!context.contentPlaceholder)
            context.contentPlaceholder = {};

         context.contentPlaceholder[data.name] = (content) => {
            this.setContent(context, instance, content);
         }
      }
      super.explore(context, instance);
   }

   prepare(context, instance) {
      if (!instance.content)
         super.prepare(context, instance);
      else {
         if (instance.content.shouldUpdate)
            instance.shouldUpdate = true;
      }
   }

   setContent(context, instance, content) {
      instance.content = content;
      if (!content.pure)
         instance.pure = false;
      if (content.shouldUpdate)
         instance.shouldUpdate = true;
   }

   cleanup(context, instance) {
      if (!instance.content)
         super.cleanup(context, instance);
   }

   render(context, instance, key) {
      const {content} = instance;
      if (content) {
         content.shouldRenderContent = true;
         var result = content.render(context);
         content.shouldRenderContent = false;
         return result;
      }

      return super.render(context, instance, key);
   }
}

ContentPlaceholder.prototype.name = 'body';

Widget.alias('content-placeholder', ContentPlaceholder);

export function contentSandbox(context, name, exploreFunction) {
   let content = context.content && context.content[name];
   let placeholder = context.contentPlaceholder && context.contentPlaceholder[name];

   if (content)
      context.content[name] = null;
   if (placeholder)
      context.contentPlaceholder[name] = null;

   exploreFunction();

   if (context.content) {
      if (content)
         context.content[name] = content;
      else
         delete context.content[name];
   }

   if (context.contentPlaceholder) {
      if (placeholder)
         context.contentPlaceholder[name] = placeholder;
      else
         delete  context.contentPlaceholder[name];
   }
}