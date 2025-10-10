
import { AugmentedViewBase } from "./AugmentedViewBase";
import { isArray } from "../util/isArray";
import { Binding } from "./Binding";

export class ArrayElementView extends AugmentedViewBase {
   arrayAccessor?: any;
   immutable?: boolean;
   recordAlias?: string;
   indexAlias?: string;
   lengthAlias?: string;
   hasNestedAliases?: boolean;
   recordBinding?: any;
   indexBinding?: any;
   lengthBinding?: any;
   itemIndex?: number;

   constructor(config?: any) {
      super(config);
      this.hasNestedAliases =
         this.recordAlias.indexOf(".") >= 0 || this.indexAlias.indexOf(".") >= 0 || this.lengthAlias.indexOf(".") >= 0;
      this.recordBinding = Binding.get(this.recordAlias);
      if (this.hasNestedAliases) {
         this.indexBinding = Binding.get(this.indexAlias);
         this.lengthBinding = Binding.get(this.lengthAlias);
      }
   }

   getExtraKeyBinding(key: string): any {
      if (!key.startsWith(this.recordAlias)) return null;
      if (key.length == this.recordAlias.length || key[this.recordAlias.length] == ".") return this.recordBinding;
      return null;
   }

   deleteExtraKeyValue(key: string): boolean {
      if (key != this.recordAlias) throw new Error(`Field ${key} cannot be deleted.`);
      const array = this.arrayAccessor.get(this.store.getData());
      if (!array) return false;
      const newArray = [...array.slice(0, this.itemIndex), ...array.slice(this.itemIndex + 1)];
      return this.arrayAccessor.set(newArray, this.store);
   }

   setExtraKeyValue(key: string, value: any): boolean {
      if (key != this.recordAlias) throw new Error(`Field ${key} is read-only.`);
      const array = this.arrayAccessor.get(this.store.getData());
      if (!array || value === array[this.itemIndex]) return false;
      const newArray = [...array.slice(0, this.itemIndex), value, ...array.slice(this.itemIndex + 1)];
      return this.arrayAccessor.set(newArray, this.store);
   }

   embedAugmentData(result: any, parentStoreData: any): void {
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
         copy = this.lengthBinding.set(copy, array.length);
         result[this.recordBinding.parts[0]] = copy[this.recordBinding.parts[0]];
         result[this.indexBinding.parts[0]] = copy[this.indexBinding.parts[0]];
         result[this.lengthBinding.parts[0]] = copy[this.lengthBinding.parts[0]];
      }
   }

   setIndex(itemIndex: number): void {
      this.itemIndex = itemIndex;
   }
}

ArrayElementView.prototype.recordAlias = "$record";
ArrayElementView.prototype.indexAlias = "$index";
ArrayElementView.prototype.lengthAlias = "$length";
