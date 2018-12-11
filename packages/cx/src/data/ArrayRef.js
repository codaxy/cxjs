import {Ref} from "./Ref";
import {append} from "./ops/append";
import {moveElement} from "./ops/moveElement";
import {insertElement} from "./ops/insertElement";

export class ArrayRef extends Ref {
   append(...args) {
      this.update(append, ...args);
   }

   insert(index, ...args) {
      this.update(insertElement, ...args)
   }

   filter(predicate) {
      this.update(array => array.filter(a => predicate(a)));
   }

   move(fromIndex, toIndex) {
      this.update(moveElement, fromIndex, toIndex);
   }

   clear() {
      this.set([]);
   }

   sort(compare) {
      let data = this.get();
      if (!data)
         return;
      let x = [...data];
      x.sort(compare);
      this.set(x);
   }
}