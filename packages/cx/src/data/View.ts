import { Binding } from "./Binding";
import { isArray } from "../util/isArray";
import { isDefined } from "../util/isDefined";
import { StoreRef } from "./StoreRef";
import { isObject } from "../util/isObject";
import { isFunction } from "../util/isFunction";
import { AccessorChain } from "./createAccessorModelProxy";
import { Ref } from "./Ref";

type Path = string | Binding;

export interface ViewConfig {
   store?: View;
   immutable?: boolean;
   sealed?: boolean;
}

export interface ViewMethods<D = Record<string, any>> {
   getData(): D;

   init(path: Path, value: unknown): boolean;
   init<V>(path: AccessorChain<V>, value: V): boolean;
   init<T extends Record<string, unknown>>(initObject: T): boolean;

   set(path: Path, value: any): boolean;
   set<T extends Record<string, any>>(changes: T): boolean;
   set<V>(path: AccessorChain<V>, value: V): boolean;

   get(path: Path): any;
   get(paths: Path[]): any[];
   get(...paths: Path[]): any[];
   get<V>(path: AccessorChain<V>): V;
   get<T extends any[]>(...paths: { [K in keyof T]: AccessorChain<T[K]> }): T;
   get<T extends any[]>(paths: { [K in keyof T]: AccessorChain<T[K]> }): T;

   /**
    * Removes data from the Store.
    * @param paths - One or more paths to be deleted.
    * @return {boolean}
    */
   delete(path: Path): boolean;
   delete(paths: Path[]): boolean;
   delete(...paths: Path[]): boolean;
   delete<V>(path: AccessorChain<V>): boolean;
   delete<T extends any[]>(...paths: { [K in keyof T]: AccessorChain<T[K]> }): boolean;
   delete<T extends any[]>(paths: { [K in keyof T]: AccessorChain<T[K]> }): boolean;

   toggle(path: Path): boolean;
   toggle(path: AccessorChain<boolean>): boolean;

   update(updateFn: (currentValue: D, ...args: any[]) => any, ...args: any): boolean;
   update<A extends any[]>(path: Path, updateFn: (currentValue: any, ...args: A) => any, ...args: A): boolean;
   update<V, A extends any[]>(
      path: AccessorChain<V>,
      updateFn: (currentValue: V, ...args: A) => V,
      ...args: A
   ): boolean;

   /**
    *  Mutates the content of the store using Immer
    */
   mutate(updateFn: (currentValue: D, ...args: any[]) => void, ...args: any[]): boolean;
   mutate<A extends any[]>(path: Path, updateFn: (currentValue: any, ...args: A) => void, ...args: A): boolean;
   mutate<V, A extends any[]>(
      path: AccessorChain<V>,
      updateFn: (currentValue: V, ...args: A) => void,
      ...args: A
   ): boolean;

   ref<T = any>(path: string | AccessorChain<T>, defaultValue?: T): Ref<T>;
}

export class View<D = any> implements ViewMethods<D> {
   declare store?: View;
   declare meta: any;
   declare sealed: boolean;
   cache: { version: number; data?: any; result?: any; itemIndex?: number; key?: string; parentStoreData?: any };
   notificationsSuspended: number = 0;
   dirty: boolean = false;

   constructor(config?: ViewConfig) {
      Object.assign(this, config);
      this.cache = {
         version: -1,
      };
      if (this.store) this.setStore(this.store);
   }

   getData(): D {
      throw new Error("abstract method");
   }

   init(path: Path, value: unknown): boolean;
   init<V>(path: AccessorChain<V>, value: V): boolean;
   init<T extends Record<string, unknown>>(initObject: T): boolean;
   init(path: any, value?: any): boolean {
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

   set(path: Path, value: any): boolean;
   set<T extends Record<string, any>>(changes: T): boolean;
   set<V>(path: AccessorChain<V>, value: V): boolean;
   set(path: any, value?: any): boolean {
      if (typeof path == "object" && path != null) {
         let changed = false;
         for (let key in path) if (path.hasOwnProperty(key) && this.setItem(key, path[key])) changed = true;
         return changed;
      }
      let binding = Binding.get(path);
      return this.setItem(binding.path, value);
   }

   copy(from: Path, to: Path): boolean;
   copy<V>(from: AccessorChain<V>, to: AccessorChain<V>): boolean;
   copy(from: any, to: any): boolean {
      let value = this.get(from);
      return this.set(to, value);
   }

   move(from: Path, to: Path): boolean;
   move<V>(from: AccessorChain<V>, to: AccessorChain<V>): boolean;
   move(from: any, to: any): boolean {
      return this.batch(() => {
         this.copy(from, to);
         this.delete(from);
      });
   }

   //protected
   setItem(path: string, value: any): boolean {
      if (this.store) return this.store.setItem(path, value);
      throw new Error("abstract method");
   }

   delete(path: Path): boolean;
   delete(paths: Path[]): boolean;
   delete(...paths: Path[]): boolean;
   delete<V>(path: AccessorChain<V>): boolean;
   delete<T extends any[]>(...paths: { [K in keyof T]: AccessorChain<T[K]> }): boolean;
   delete<T extends any[]>(paths: { [K in keyof T]: AccessorChain<T[K]> }): boolean;
   delete(path?: any): boolean {
      if (arguments.length > 1) path = Array.from(arguments);
      if (isArray(path)) return path.map((arg) => this.delete(arg as Path)).some(Boolean);

      let binding = Binding.get(path);
      return this.deleteItem(binding.path);
   }

   //protected
   deleteItem(path: string): boolean {
      if (this.store) return this.store.deleteItem(path);

      throw new Error("abstract method");
   }

   clear(): void {
      if (this.store) return this.store.clear();

      throw new Error("abstract method");
   }

   get(path: Path): any;
   get(paths: Path[]): any[];
   get(...paths: Path[]): any[];
   get<V>(path: AccessorChain<V>): V;
   get<T extends any[]>(...paths: { [K in keyof T]: AccessorChain<T[K]> }): T;
   get<T extends any[]>(paths: { [K in keyof T]: AccessorChain<T[K]> }): T;
   get(path?: any, ...args: any[]): any {
      let storeData = this.getData();

      if (arguments.length > 1) path = Array.from(arguments);

      if (isArray(path)) return path.map((arg) => Binding.get(arg as any).value(storeData));

      return Binding.get(path).value(storeData);
   }

   toggle(path: Path): boolean;
   toggle(path: AccessorChain<boolean>): boolean;
   toggle(path: any): boolean {
      return this.set(path, !this.get(path));
   }

   update(updateFn: (currentValue: D, ...args: any[]) => any, ...args: any): boolean;
   update<A extends any[]>(path: Path, updateFn: (currentValue: any, ...args: A) => any, ...args: A): boolean;
   update<V, A extends any[]>(
      path: AccessorChain<V>,
      updateFn: (currentValue: V, ...args: A) => V,
      ...args: A
   ): boolean;
   update(path: any, updateFn?: any, ...args: any[]): boolean {
      if (arguments.length == 1 && isFunction(path))
         return this.load(path.apply(null, [this.getData(), updateFn, ...args]));
      return this.set(path, updateFn.apply(null, [this.get(path), ...args]));
   }

   mutate(updateFn: (currentValue: D, ...args: any[]) => void, ...args: any[]): boolean;
   mutate<A extends any[]>(path: Path, updateFn: (currentValue: any, ...args: A) => void, ...args: A): boolean;
   mutate<V, A extends any[]>(
      path: AccessorChain<V>,
      updateFn: (currentValue: V, ...args: A) => void,
      ...args: A
   ): boolean;
   mutate(path?: any, updateFn?: any, ...args: any[]): boolean {
      throw new Error(
         "Mutate requires Immer. Please install 'immer' and 'cx-immer' packages and enable store mutation by calling enableImmerMutate().",
      );
   }

   batch(callback: (store?: View) => void): boolean {
      let dirty = this.silently(callback);
      if (dirty) this.notify();
      return dirty;
   }

   silently(callback: (store?: View) => void): boolean {
      if (this.store) return this.store.silently(callback);

      throw new Error("abstract method");
   }

   notify(path?: string): void {
      if (this.notificationsSuspended) this.dirty = true;
      else this.doNotify(path);
   }

   doNotify(path?: string): void {
      if (this.store) return this.store.notify(path);

      throw new Error("abstract method");
   }

   subscribe(callback: (changes?: any) => void): () => void {
      if (this.store) return this.store.subscribe(callback);

      throw new Error("abstract method");
   }

   load(data: Record<string, any>): boolean {
      return this.set(data);
   }

   dispatch(action: any): void {
      if (this.store) return this.store.dispatch(action);

      throw new Error("The underlying store doesn't support dispatch.");
   }

   getMeta() {
      return this.meta;
   }

   setStore(store: View) {
      this.store = store;
      this.meta = store.getMeta();
   }

   ref<T = any>(path: string | AccessorChain<T>, defaultValue?: T): Ref<T> {
      if (isDefined(defaultValue)) this.init(path as any, defaultValue);
      return StoreRef.create({
         store: this,
         path,
      }) as Ref<T>;
   }

   getMethods(): ViewMethods<D> {
      return {
         getData: this.getData.bind(this),
         set: this.set.bind(this),
         get: this.get.bind(this),
         update: this.update.bind(this),
         delete: this.delete.bind(this),
         toggle: this.toggle.bind(this),
         init: this.init.bind(this),
         ref: this.ref.bind(this),
         mutate: this.mutate.bind(this),
      };
   }
}

View.prototype.sealed = false; //indicate that data should be copied before virtual items are added
