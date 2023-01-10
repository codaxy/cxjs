import { isAccessorChain } from "./createAccessorModelProxy";
import { Ref } from "./Ref";

export class StoreRef extends Ref {
   constructor(config) {
      super(config);
      if (isAccessorChain(this.path)) this.path = this.path.toString();
   }

   get() {
      return this.store.get(this.path);
   }

   set(value) {
      return this.store.set(this.path, value);
   }

   init(value) {
      return this.store.init(this.path, value);
   }

   toggle() {
      return this.store.toggle(this.path);
   }

   delete() {
      return this.store.delete(this.path);
   }

   update(...args) {
      return this.store.update(this.path, ...args);
   }

   //allows the function to be passed as a selector, e.g. to computable or addTrigger
   memoize() {
      return this.get;
   }

   ref(path) {
      return new StoreRef({
         path: `${this.path}.${path}`,
         store: this.store,
      });
   }

   as(config) {
      return StoreRef.create(config, {
         path: this.path,
         store: this.store,
         get: this.get,
         set: this.set,
      });
   }
}
