import {PureContainerBase, PureContainerConfig} from './PureContainer';
import {isPromise} from '../util/isPromise';
import {RenderingContext} from './RenderingContext';
import {BooleanProp, StructuredProp} from './Prop';
import {Instance} from './Instance';

export interface ContentResolverConfig extends PureContainerConfig {
   /** Parameters that trigger content resolution when changed. */
   params?: StructuredProp;

   /** Callback function that resolves content based on params. Can return content directly or a Promise. */
   onResolve?: string | ((params: any, instance: Instance) => any);

   /** How to combine resolved content with initial content. Default is 'replace'. */
   mode?: "replace" | "prepend" | "append";

   /** Indicates if content is being loaded. */
   loading?: BooleanProp;
}

export class ContentResolver extends PureContainerBase<ContentResolverConfig> {
   constructor(config?: ContentResolverConfig) {
      super(config);
   }

   declare mode: "replace" | "prepend" | "append";
   onResolve?: string | ((params: any, instance: Instance) => any);
   declare initialItems: any;

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
