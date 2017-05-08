import {PureContainer} from './PureContainer';
import {Widget} from './Widget';
import {isPromise} from '../util/isPromise';

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

      if (data.params !== instance.cachedParams && this.onResolve) {
         instance.cachedParams = data.params;
         let content = this.onResolve(data.params, instance);
         if (isPromise(content)) {
            content.then(cnt => {
               this.setContent(instance, cnt);
               instance.setState({cacheBuster: {}});
            })
         }
         else
            this.setContent(instance, content);
      }
   }

   setContent(instance, content) {
      if (content) {
         let cnt = Widget.create(content);
         if (!Array.isArray(cnt))
            cnt = [cnt];
         switch (this.mode) {
            case 'prepend':
               cnt = [...cnt, ...this.initialItems];
               break;

            case 'append':
               cnt = [...this.initialItems, ...cnt];
               break;
         }
         instance.content = cnt;
      }
      else
         instance.content = this.initialItems;
   }

   explore(context, instance) {
      this.items = instance.content;
      super.explore(context, instance);
   }
}

ContentResolver.prototype.mode = 'replace';
ContentResolver.prototype.params = null;