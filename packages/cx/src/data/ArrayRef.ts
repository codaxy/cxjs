import {Ref} from "./Ref";
import {append} from "./ops/append";
import {moveElement} from "./ops/moveElement";
import {insertElement} from "./ops/insertElement";

export class ArrayRef<T = any> extends Ref<T[]> {
   append(...args: T[]): void {
      this.update(append, ...args);
   }

   insert(index: number, ...args: T[]): void {
      this.update(insertElement, ...args)
   }

   filter(predicate: (item: T, index?: number) => boolean): void {
      this.update(array => array.filter(a => predicate(a)));
   }

   move(fromIndex: number, toIndex: number): void {
      this.update(moveElement, fromIndex, toIndex);
   }

   clear(): void {
      this.set([]);
   }

   sort(compare: (a: T, b: T) => number): void {
      let data = this.get();
      if (!data)
         return;
      let x = [...data];
      x.sort(compare);
      this.set(x);
   }
}