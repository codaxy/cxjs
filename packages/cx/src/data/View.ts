
import { Binding } from "./Binding";
import { isArray } from "../util/isArray";
import { isDefined } from "../util/isDefined";
import { StoreRef } from "./StoreRef";
import { isObject } from "../util/isObject";
import { isFunction } from "../util/isFunction";

export class View {
   store?: View;
   data?: any;
   meta?: any;
   cache?: { version: number; data?: any; result?: any; itemIndex?: number; key?: string; parentStoreData?: any };
   sealed?: boolean;
   notificationsSuspended?: number;
   dirty?: boolean;
   mutate?: any;

   constructor(config?: any) {
      Object.assign(this, config);
      this.cache = {
         version: -1,
      };
      if (this.store) this.setStore(this.store);
   }

   getData() {
      throw new Error("abstract method");
   }

   init(path, value) {
      if (typeof path == "object" && path != null) {
         let changed = false;
         for (let key in path)
            if (path.hasOwnProperty(key) && this.get(key) === undefined && this.setItem(key, path[key])) changed = true;
         return changed;
      }
      let binding = Binding.get(path);
      if (this.get(binding.path) === undefined) return this.setItem(binding.path, value);
      return false;
   }

   set(path, value) {
      if (isObject(path)) {
         let changed = false;
         for (let key in path) if (path.hasOwnProperty(key) && this.setItem(key, path[key])) changed = true;
         return changed;
      }
      let binding = Binding.get(path);
      return this.setItem(binding.path, value);
   }

   copy(from, to) {
      let value = this.get(from);
      this.set(to, value);
   }

   move(from, to) {
      this.batch(() => {
         this.copy(from, to);
         this.delete(from);
      });
   }

   //protected
   setItem(path, value) {
      if (this.store) return this.store.setItem(path, value);
      throw new Error("abstract method");
   }

   delete(path) {
      if (arguments.length > 1) path = Array.from(arguments);
      if (isArray(path)) return path.map((arg) => this.delete(arg)).some(Boolean);

      let binding = Binding.get(path);
      return this.deleteItem(binding.path);
   }

   //protected
   deleteItem(path) {
      if (this.store) return this.store.deleteItem(path);

      throw new Error("abstract method");
   }

   clear() {
      if (this.store) return this.store.clear();

      throw new Error("abstract method");
   }

   get(path) {
      let storeData = this.getData();

      if (arguments.length > 1) path = Array.from(arguments);

      if (isArray(path)) return path.map((arg) => Binding.get(arg).value(storeData));

      return Binding.get(path).value(storeData);
   }

   toggle(path) {
      return this.set(path, !this.get(path));
   }

   update(path, updateFn, ...args) {
      if (arguments.length == 1 && isFunction(path))
         return this.load(path.apply(null, [this.getData(), updateFn, ...args]));
      return this.set(path, updateFn.apply(null, [this.get(path), ...args]));
   }

   batch(callback) {
      let dirty = this.silently(callback);
      if (dirty) this.notify();
      return dirty;
   }

   silently(callback) {
      if (this.store) return this.store.silently(callback);

      throw new Error("abstract method");
   }

   notify(path) {
      if (this.notificationsSuspended) this.dirty = true;
      else this.doNotify(path);
   }

   doNotify(path) {
      if (this.store) return this.store.notify(path);

      throw new Error("abstract method");
   }

   subscribe(callback) {
      if (this.store) return this.store.subscribe(callback);

      throw new Error("abstract method");
   }

   load(data) {
      return this.batch((store) => {
         for (let key in data) store.set(key, data[key]);
      });
   }

   dispatch(action) {
      if (this.store) return this.store.dispatch(action);

      throw new Error("The underlying store doesn't support dispatch.");
   }

   getMeta() {
      return this.meta;
   }

   setStore(store) {
      this.store = store;
      this.meta = store.getMeta();
   }

   ref(path, defaultValue) {
      if (isDefined(defaultValue)) this.init(path, defaultValue);
      return StoreRef.create({
         store: this,
         path,
      });
   }

   getMethods() {
      return {
         getData: this.getData.bind(this),
         set: this.set.bind(this),
         get: this.get.bind(this),
         update: this.update.bind(this),
         delete: this.delete.bind(this),
         toggle: this.toggle.bind(this),
         init: this.init.bind(this),
         ref: this.ref.bind(this),
         mutate: this.ref.bind(this),
      };
   }
}

View.prototype.sealed = false; //indicate that data should be copied before virtual items are added

//Immer integration point
View.prototype.mutate = function () {
   throw new Error(
      "Mutate requires Immer. Please install 'immer' and 'cx-immer' packages and enable store mutation by calling enableImmerMutate()."
   );
};
