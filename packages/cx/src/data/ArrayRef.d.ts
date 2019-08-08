import {Ref} from "./Ref";

export class ArrayRef<T = any> extends Ref<T[]> {
   append(...args: T[]);

   insert(index, ...args: T[]);

   filter(predicate: (item: T, index?: number) => boolean);

   move(fromIndex: number, toIndex: number);

   clear();

   sort(compare: (a: T, b: T) => number);
}