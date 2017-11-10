import {Widget} from '../ui/Widget';

export class DocumentTitle extends Widget {
   init() {
      if (this.value)
         this.text = this.value;

      if (this.append)
         this.action = "append";

      super.init();
   }

   declareData() {
      super.declareData(...arguments, {
         value: undefined,
         text: undefined,
         action: undefined,
         separator: undefined
      });
   }

   explore(context, instance) {
      if (!context.documentTitle) {
         context.documentTitle = {
            activeInstance: instance,
            title: ''
         }
      }

      let {data} = instance;

      if (data.text) {

         switch (data.action) {
            case "append":
               if (context.documentTitle.title)
                  context.documentTitle.title += data.separator;
               context.documentTitle.title += data.text;
               break;

            case "prepend":
               context.documentTitle.title = data.text + data.separator + context.documentTitle.title;
               break;

            default:
            case "replace":
               context.documentTitle.title = data.text;
               break;
         }
      }

      super.explore(context, instance);
   }

   prepare(context, instance) {
      if (context.documentTitle.activeInstance == instance)
         document.title = context.documentTitle.title;
   }

   render() {
      return null;
   }
}

DocumentTitle.prototype.action = "append";
DocumentTitle.prototype.separator = '';

Widget.alias('document-title', DocumentTitle);