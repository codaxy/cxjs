import {Binding} from './Binding';
import {SubscribableView} from './SubscribableView';

interface StoreConfig<D = any> {
   async?: boolean;
   data?: D;
}

export class Store<D = any> extends SubscribableView {
   async?: boolean;

   constructor(config: StoreConfig<D> = {}) {
      super(config);
      this.data = config.data || {};
      this.meta = {
         version: 0
      }
   }

   getData(): D {
      return this.data;
   }

   setItem(path: string, value: any): boolean {
      let next = Binding.get(path).set(this.data, value);
      if (next != this.data) {
         this.data = next;
         this.meta.version++;
         this.notify(path);
         return true;
      }
      return false;
   }

   deleteItem(path: string): boolean {
      let next = Binding.get(path).delete(this.data);
      if (next != this.data) {
         this.data = next;
         this.meta.version++;
         this.notify(path);
         return true;
      }
      return false;
   }

   clear(): void {
      this.data = {};
      this.meta.version++;
      this.notify();
   }
}

Store.prototype.async = false;
