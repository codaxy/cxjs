import {PureContainer} from './PureContainer';
import {Widget} from './Widget';

export class ContentResolver extends PureContainer {
   declareData() {
      return super.declareData(...arguments, {
         params: {structured: true}
      })
   }

   init() {
      super.init();
      this.initialItems = this.items;
   }

   prepareData(context, instance) {
      let {data} = instance;
      let content = null;
      let items = this.items;


      if (data.params && data.params != this.cachedParams && this.onResolve) {
         this.cachedParams = data.params;
         let x = this.onResolve(data.params, instance);
         if (x) {
            content = Widget.create(x);
            if (!Array.isArray(content))
               content = [content];

            switch (this.mode) {
               case 'prepend':
                  items = [...content, ...this.initialItems];
                  break;

               case 'append':
                  items = [...this.initialItems, ...content];
                  break;

               default:
                  items = content;
                  break;
            }

            this.items = items;
         }
      }
   }
}

ContentResolver.prototype.mode = 'replace';