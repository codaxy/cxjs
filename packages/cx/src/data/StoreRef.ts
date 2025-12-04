import { isAccessorChain } from "./createAccessorModelProxy";
import { Ref, RefConfig } from "./Ref";
import { View } from "./View";

interface StoreRefConfig<T> extends RefConfig<T> {
   store: View;
   path: string;
}

export class StoreRef<T = any> extends Ref<T> {
   declare store: View;
   declare path: string;

   constructor(config: StoreRefConfig<T>) {
      super(config);
      if (isAccessorChain(this.path)) this.path = this.path.toString();
   }

   get() {
      return this.store.get(this.path);
   }

   set(value: T): boolean {
      return this.store.set(this.path, value);
   }

   init(): void;
   init(value: T): boolean;
   init(value?: T): boolean | void {
      if (value === undefined) return;
      return this.store.init(this.path, value);
   }

   toggle() {
      return this.store.toggle(this.path);
   }

   delete() {
      return this.store.delete(this.path);
   }

   update(cb: (currentValue: T, ...args: any[]) => T, ...args: any[]): boolean {
      return this.store.update(this.path, cb, ...args);
   }

   //allows the function to be passed as a selector, e.g. to computable or addTrigger
   memoize() {
      return this.get;
   }

   ref<ST = any>(path: string): StoreRef<ST> {
      return new StoreRef<ST>({
         path: `${this.path}.${path}`,
         store: this.store,
      });
   }

   as(config: RefConfig<T>) {
      return StoreRef.create(config, {
         path: this.path,
         store: this.store,
         get: this.get,
         set: this.set,
      });
   }
}
