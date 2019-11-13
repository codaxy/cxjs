import {Ref} from "./Ref";

export class StoreRef extends Ref {
   constructor(config) {
      super(config);
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

   as(config) {
      return StoreRef.create(config, {
         path: this.path,
         store: this.store,
         get: this.get,
         set: this.set
      });
   }
}

