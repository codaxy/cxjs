import {AugmentedViewBase} from "./AugmentedViewBase";
import { isArray} from "../util/isArray";

export class ArrayElementView extends AugmentedViewBase {

   isExtraKey(key) {
      return key == this.recordAlias || key == this.indexAlias || key == this.lengthAlias;
   }

   deleteExtraKeyValue(key) {
      if (key != this.recordAlias)
         throw new Error(`Field ${key} cannot be deleted.`);
      const array = this.arrayAccessor.get(this.store.getData());
      if (!array)
         return false;
      const newArray = [...array.slice(0, this.itemIndex), ...array.slice(this.itemIndex + 1)];
      return this.arrayAccessor.set(newArray, this.store);
   }

   setExtraKeyValue(key, value) {
      if (key != this.recordAlias)
         throw new Error(`Field ${key} is read-only.`);

      const array = this.arrayAccessor.get(this.store.getData());
      if (!array || value === array[this.itemIndex])
         return false;
      const newArray = [...array.slice(0, this.itemIndex), value, ...array.slice(this.itemIndex + 1)];
      return this.arrayAccessor.set(newArray, this.store);
   }

   embedAugmentData(result, parentStoreData) {
      let array = this.arrayAccessor.get(parentStoreData);
      if (!isArray(array)) return;
      result[this.recordAlias] = array[this.itemIndex];
      result[this.indexAlias] = this.itemIndex;
      result[this.lengthAlias] = array.length;
   }

   setIndex(itemIndex) {
      this.itemIndex = itemIndex;
   }
}

ArrayElementView.prototype.recordAlias = '$record';
ArrayElementView.prototype.indexAlias = '$index';
ArrayElementView.prototype.lengthAlias = '$length';
