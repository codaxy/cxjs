import { View } from "./View";
import { Binding } from "./Binding";

export class AugmentedViewBase extends View {
   immutable: boolean;
   store: View;

   getData() {
      if (this.sealed && this.meta.version === this.cache.version && this.meta === this.store.meta)
         return this.cache.result;
      let parentStoreData = this.store.getData();
      let result = this.getBaseData(parentStoreData);
      this.embedAugmentData(result, parentStoreData);
      this.cache.result = result;
      this.cache.parentStoreData = parentStoreData;
      this.cache.version = this.meta.version;
      this.meta = this.store.meta;
      return this.cache.result;
   }

   protected getBaseData(parentStoreData: any): any {
      if (this.sealed || this.immutable || this.store.sealed) return { ...parentStoreData };
      return parentStoreData;
   }

   protected embedAugmentData(result: any, parentStoreData: any): void {
      throw new Error("abstract");
   }

   protected isExtraKey(key: string): boolean {
      throw new Error("abstract");
   }

   // Stores which need to support nested aliases should override this method
   protected getExtraKeyBinding(key: string): any {
      let binding = Binding.get(key);
      return this.isExtraKey(binding.parts[0]) ? Binding.get(binding.parts[0]) : null;
   }

   protected setExtraKeyValue(key: string, value: any): boolean {
      throw new Error("abstract");
   }

   protected deleteExtraKeyValue(key: string): boolean {
      throw new Error("abstract");
   }

   setItem(path: string, value: any): boolean {
      let extraKeyBinding = this.getExtraKeyBinding(path);
      if (extraKeyBinding) {
         let binding = Binding.get(path);
         let newValue = value;
         if (binding.parts.length > extraKeyBinding.parts.length) {
            let data = {};
            this.embedAugmentData(data, this.store.getData());
            let binding = Binding.get(path);
            data = binding.set(data, value);
            newValue = extraKeyBinding.value(data);
         }
         return this.setExtraKeyValue(extraKeyBinding.path, newValue);
      }
      return super.setItem(path, value);
   }

   deleteItem(path: string): boolean {
      let extraKeyBinding = this.getExtraKeyBinding(path);
      if (extraKeyBinding) {
         if (path == extraKeyBinding.path) return this.deleteExtraKeyValue(extraKeyBinding.path);
         let data = {};
         this.embedAugmentData(data, this.store.getData());
         let binding = Binding.get(path);
         data = binding.delete(data);
         let newValue = extraKeyBinding.value(data);
         return this.setExtraKeyValue(extraKeyBinding.path, newValue);
      }
      return super.deleteItem(path);
   }
}

AugmentedViewBase.prototype.immutable = false;
