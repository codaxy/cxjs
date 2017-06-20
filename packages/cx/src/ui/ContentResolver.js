import {PureContainer} from './PureContainer';
import {Widget} from './Widget';
import {isPromise} from '../util/isPromise';

export class ContentResolver extends PureContainer {
   declareData() {
      return super.declareData(...arguments, {
         params: {structured: true},
         loading: undefined
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
         let content = instance.invoke("onResolve", data.params, instance);
         if (isPromise(content)) {
            instance.set('loading', true);
            content.then(cnt => {
               this.setContent(instance, cnt);
               instance.setState({cacheBuster: {}});
               instance.set('loading', false);
            })
         }
         else
            this.setContent(instance, content);
      }
   }

   setContent(instance, content) {
      if (content) {
         this.items = [];
         switch (this.mode) {
            case 'prepend':
               this.add(content);
               this.add(this.initialItems);
               break;

            case 'append':
               this.add(content);
               this.add(this.initialItems);
               break;

            case "replace":
               this.add(content);
               break;
         }
         instance.content = this.items;
      }
      else
         instance.content = this.initialItems;

      this.items = this.initialItems;
   }

   explore(context, instance) {
      this.items = instance.content;
      super.explore(context, instance);
   }
}

ContentResolver.prototype.mode = 'replace';
ContentResolver.prototype.params = null;