import { AugmentedViewBase } from "./AugmentedViewBase";
import { isArray } from "../util/isArray";
import { Binding } from "./Binding";

export class ArrayElementView extends AugmentedViewBase {
   constructor(config) {
      super(config);
      this.hasNestedAliases =
         this.recordAlias.indexOf(".") >= 0 || this.indexAlias.indexOf(".") >= 0 || this.lengthAlias.indexOf(".") >= 0;
      if (this.hasNestedAliases) {
         this.recordBinding = Binding.get(this.recordAlias);
         this.indexBinding = Binding.get(this.indexAlias);
         this.lengthAlias = Binding.get(this.lengthAlias);
      }
   }

   isExtraKey(key) {
      if (!this.hasNestedAliases) return key == this.recordAlias || key == this.indexAlias || key == this.lengthAlias;
      return (
         key == this.recordBinding.parts[0] || key == this.indexBinding.parts[0] || key == this.lengthAlias.parts[0]
      );
   }

   deleteExtraKeyValue(key) {
      if (this.hasNestedAliases ? key != this.recordBinding.parts[0] : key != this.recordAlias)
         throw new Error(`Field ${key} cannot be deleted.`);
      const array = this.arrayAccessor.get(this.store.getData());
      if (!array) return false;
      const newArray = [...array.slice(0, this.itemIndex), ...array.slice(this.itemIndex + 1)];
      return this.arrayAccessor.set(newArray, this.store);
   }

   setExtraKeyValue(key, value) {
      if (this.hasNestedAliases ? key != this.recordBinding.parts[0] : key != this.recordAlias)
         throw new Error(`Field ${key} is read-only.`);
      const array = this.arrayAccessor.get(this.store.getData());
      if (!array || value === array[this.itemIndex]) return false;
      const newArray = [...array.slice(0, this.itemIndex), value, ...array.slice(this.itemIndex + 1)];
      return this.arrayAccessor.set(newArray, this.store);
   }

   embedAugmentData(result, parentStoreData) {
      let array = this.arrayAccessor.get(parentStoreData);
      if (!isArray(array)) return;
      if (!this.hasNestedAliases) {
         result[this.recordAlias] = array[this.itemIndex];
         result[this.indexAlias] = this.itemIndex;
         result[this.lengthAlias] = array.length;
      } else {
         let copy = result;
         copy = this.recordBinding.set(copy, array[this.itemIndex]);
         copy = this.indexBinding.set(copy, this.itemIndex);
         copy = this.lengthAlias.set(copy, array.length);
         result[this.recordBinding.parts[0]] = copy[this.recordBinding.parts[0]];
         result[this.indexBinding.parts[0]] = copy[this.indexBinding.parts[0]];
         result[this.lengthAlias.parts[0]] = copy[this.lengthAlias.parts[0]];
      }
   }

   setIndex(itemIndex) {
      this.itemIndex = itemIndex;
   }
}

ArrayElementView.prototype.recordAlias = "$record";
ArrayElementView.prototype.indexAlias = "$index";
ArrayElementView.prototype.lengthAlias = "$length";
