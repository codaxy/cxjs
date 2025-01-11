import { Record, AccessorChain } from "../core";
import { Binding } from "./Binding";
import { Ref } from "./Ref";

declare type Path = string | Binding;

export interface ViewConfig {
   store?: View;

   /* When set, the root data object of the parent store will be preserved (no virtual properties will be added), i.e. $record. */
   immutable?: boolean;

   /* When set, instructs the child views not to modify its data object (same effect as setting immutable on child stores). */
   sealed?: boolean;
}

export interface ViewMethods<D = Record> {
   getData(): D;

   init(path: Path, value: any): boolean;
   init<V>(path: AccessorChain<V>, value: V | any): boolean;

   set(path: Path, value: any): boolean;
   set(changes: Record): boolean;
   set<V>(path: AccessorChain<V>, value: V | any): boolean;

   get(path: Path): any;
   get(paths: Path[]): any[];
   get(...paths: Path[]): any[];
   get<V>(path: AccessorChain<V>): V;

   /**
    * Removes data from the Store.
    * @param paths - One or more paths to be deleted.
    * @return {boolean}
    */
   delete(path: Path): boolean;
   delete(paths: Path[]): boolean;
   delete(...paths: Path[]): boolean;
   delete<V>(path: AccessorChain<V>): boolean;

   toggle(path: Path): boolean;

   update(updateFn: (currentValue: D, ...args) => D, ...args): boolean;
   update(path: Path, updateFn: (currentValue: any, ...args) => any, ...args): boolean;
   update<V>(path: AccessorChain<V>, updateFn: (currentValue: V, ...args) => V, ...args): boolean;

   /**
    *  Mutates the content of the store using Immer
    */
   mutate(updateFn: (currentValue: D, ...args) => D, ...args): boolean;
   mutate(path: Path, updateFn: (currentValue: any, ...args) => any, ...args): boolean;
   mutate<V>(path: AccessorChain<V>, updateFn: (currentValue: V, ...args) => V, ...args): boolean;

   ref<T = any>(path: string | AccessorChain<T>, defaultValue?: T): Ref<T>;
}

export class View<D = any> implements ViewMethods<D> {
   constructor(config?: ViewConfig);

   getData(): D;

   init(path: Path, value: any): boolean;
   init<V>(path: AccessorChain<V>, value: V): boolean;

   set(path: Path, value: any): boolean;
   set(changes: Record): boolean;
   set<V>(path: AccessorChain<V>, value: V | any): boolean;

   /**
    * Copies the value stored under the `from` path and saves it under the `to` path.
    * @param from - Origin path.
    * @param to - Destination path.
    */
   copy(from: Path, to: Path): boolean;
   copy<V>(from: AccessorChain<V>, to: AccessorChain<V>): boolean;

   move(from: Path, to: Path): boolean;
   move<V>(from: AccessorChain<V>, to: AccessorChain<V>): boolean;

   /**
    * Removes data from the Store.
    * @param paths - Any number or an array of paths to be deleted.
    * @return {boolean}
    */
   delete(path: Path): boolean;
   delete(paths: Path[]): boolean;
   delete(...paths: Path[]): boolean;
   delete<V>(path: AccessorChain<V>): boolean;

   clear(): void;

   get(path: Path): any;
   get(paths: Path[]): any;
   get(...paths: Path[]): any;
   get<V>(path: AccessorChain<V>): V;

   toggle(path: Path): boolean;
   toggle(path: AccessorChain<boolean>): boolean;

   update(updateFn: (currentValue: D, ...args) => any, ...args): boolean;
   update(path: Path, updateFn: (currentValue: any, ...args) => any, ...args): boolean;
   update<V>(path: AccessorChain<V>, updateFn: (currentValue: V, ...args) => V, ...args): boolean;

   mutate(updateFn: (currentValue: D, ...args) => void, ...args): boolean;
   mutate(path: Path, updateFn: (currentValue: any, ...args) => void, ...args): boolean;
   mutate<V>(path: AccessorChain<V>, updateFn: (currentValue: V, ...args) => void, ...args): boolean;

   /**
    * `batch` method can be used to perform multiple Store operations silently
    * and re-render the application only once afterwards. The Store instance
    * is passed to the `callback` function.
    * @param callback - Function that will perform multiple Store operations
    * @return {boolean}
    */
   batch(callback: (store: View) => void): boolean;

   silently(callback: () => void): boolean;

   notify(path?: string): void;

   subscribe(callback: (changes?) => void): () => void;

   load(data: Record): boolean;

   dispatch(action): void;

   getMethods(): ViewMethods;

   ref<T = any>(path: string | AccessorChain<T>, defaultValue?: T): Ref<T>;
}
