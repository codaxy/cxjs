import { Binding } from "./Binding";
import { SubscribableView } from "./SubscribableView";

interface StoreConfig<D = any> {
   async?: boolean;
   data?: D;
}

export class Store<D extends Record<string, any> = any> extends SubscribableView<D> {
   data: D;

   constructor(config: StoreConfig<D> = {}) {
      super(config);
      this.data = config.data ?? ({} as D);
      this.meta = {
         version: 0,
      };
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
      this.data = {} as D;
      this.meta.version++;
      this.notify();
   }
}

Store.prototype.async = false;
