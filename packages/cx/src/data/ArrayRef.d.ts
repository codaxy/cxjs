import {Ref} from "./Ref";

export class ArrayRef<T = any> extends Ref<T[]> {
   append(...args);

   insert(index, ...args);

   filter(predicate);

   move(fromIndex, toIndex);

   clear();

   sort(compare);
}