import {PureContainer} from "./PureContainer";
import {SubscribableView} from '../data/SubscribableView';
import {getSelector} from '../data/getSelector';
import {Cx} from './Cx';
import {VDOM} from './Widget';
import {IsolatedScope} from './IsolatedScope';

export class DetachedScope extends IsolatedScope {

   declareData() {
      return super.declareData(...arguments, {
         exclusiveData: {structured: true}
      })
   }

   init() {
      if (typeof this.exclusive === 'string')
         this.exclusiveData = {bind: this.exclusive};
      if (Array.isArray(this.exclusive)) {
         this.exclusiveData = {};
         this.exclusive.forEach((x, i) => {
            this.exclusiveData[String(i)] = {bind: x}
         });
      }

      this.container = PureContainer.create({
         type: PureContainer,
         items: this.children || this.items
      });
      delete this.items;
      delete this.children;

      if (this.name)
         this.options = {
            ...this.options,
            name: this.name
         };

      super.init();
   }

   initInstance(context, instance) {
      instance.subStore = new ContainmentStore({
         store: instance.store,
         selector: getSelector(this.exclusiveData || this.data)
      });
   }

   render(context, instance, key) {
      return <Cx
         key={key}
         widget={this.container}
         store={instance.subStore}
         parentInstance={instance}
         subscribe
         options={this.options}
      />
   }
}

class ContainmentStore extends SubscribableView {

   getData() {
      return this.store.getData();
   }

   setItem(...args) {
      return this.wrapper(()=>{
         this.store.setItem(...args);
      })
   }

   deleteItem(...args) {
      return this.wrapper(()=>{
         this.store.deleteItem(...args);
      })
   }

   wrapper(callback) {
      if (this.store.silently(callback)) {
         let data = this.getData();
         let containedData = this.selector(data);
         if (containedData === this.cache.containedData) {
            this.store.notify();
         } else {
            this.cache.containedData = containedData;
            this.notify();
         }
         return true;
      }
      return false;
   }
}