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

   initInstance(context, instance) {
      instance.content = this.initialItems;
   }

   prepareData(context, instance) {
      let {data} = instance;

      if (data.params && data.params != instance.cachedParams && this.onResolve) {
         instance.cachedParams = data.params;
         let x = this.onResolve(data.params, instance);
         if (x) {
            let content = Widget.create(x);
            if (!Array.isArray(content))
               content = [content];
            switch (this.mode) {
               case 'prepend':
                  content = [...content, ...this.initialItems];
                  break;

               case 'append':
                  content = [...this.initialItems, ...content];
                  break;
            }
            instance.content = content;
         }
         else
            instance.content = this.initialItems;
      }
   }

   explore(context, instance) {
      this.items = instance.content;
      super.explore(context, instance);
   }
}

ContentResolver.prototype.mode = 'replace';