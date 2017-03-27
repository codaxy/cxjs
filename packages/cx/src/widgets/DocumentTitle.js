import {Widget} from '../ui/Widget';

export class DocumentTitle extends Widget
{
   declareData() {
      super.declareData(...arguments, {
         value: undefined
      });
   }

   explore(context, instance) {
      if (!context.documentTitle) {
         context.documentTitle = {
            activeInstance: instance,
            title: ''
         }
      }

      if (instance.data.value) {
         if (this.append)
            context.documentTitle.title += instance.data.value;
         else {
            context.documentTitle.title = instance.data.value;
            context.documentTitle.activeInstance = instance;
         }
      }

      super.explore(context, instance);
   }

   prepare(context, instance) {
      super.prepare(context, instance);
      if (context.documentTitle.activeInstance == instance)
         document.title = context.documentTitle.title;
   }

   render() {
      return null;
   }
}

DocumentTitle.prototype.pure = false;
DocumentTitle.prototype.append = true;

Widget.alias('document-title', DocumentTitle);