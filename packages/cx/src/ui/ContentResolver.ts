import {PureContainer} from './PureContainer';
import {isPromise} from '../util/isPromise';
import {RenderingContext} from './RenderingContext';

export class ContentResolver extends PureContainer {
   mode: "replace" | "prepend" | "append";
   onResolve?: (params: any, instance: any) => any;
   initialItems: any;

   declareData(...args: any[]): void {
      super.declareData(...args, {
         params: {structured: true},
         loading: undefined
      })
   }

   init(): void {
      super.init();
      this.initialItems = this.layout ? this.layout.items : this.items;
      this.clear();
   }

   initInstance(context: RenderingContext, instance: any): void {
      instance.content = this.initialItems;
      instance.cachedParams = {}; //unique value which will never pass the equality check
   }

   prepareData(context: RenderingContext, instance: any): void {
      let {data} = instance;

      if (data.params !== instance.cachedParams && this.onResolve) {
         instance.cachedParams = data.params;
         let content = instance.invoke("onResolve", data.params, instance);
         if (isPromise(content)) {
            instance.set('loading', true);
            this.setContent(instance, null);
            content.then((cnt: any) => {
               this.setContent(instance, cnt);
               instance.setState({cacheBuster: {}});
               instance.set('loading', false);
            })
         }
         else
            this.setContent(instance, content);
      }
   }

   setContent(instance: any, content: any): void {
      if (content) {
         this.clear();
         switch (this.mode) {
            case 'prepend':
               this.add(content);
               this.add(this.initialItems);
               break;

            case 'append':
               this.add(this.initialItems);
               this.add(content);
               break;

            case "replace":
               this.add(content);
               break;
         }
         instance.content = this.layout ? this.layout.items : this.items;
         this.clear();
      }
      else
         instance.content = this.initialItems;
   }

   explore(context: RenderingContext, instance: any): void {
      //a little bit hacky
      if (this.layout)
         this.layout.items = instance.content;
      else
         this.items = instance.content;
      super.explore(context, instance);
   }
}

ContentResolver.prototype.mode = 'replace';
