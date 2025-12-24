import { Binding } from "./Binding";
import { NestedDataView, NestedDataViewConfig } from "./NestedDataView";

export interface ZoomIntoPropertyViewConfig extends NestedDataViewConfig {
   binding: Binding;
   rootName?: string;
}

export class ZoomIntoPropertyView extends NestedDataView {
   declare binding: Binding;
   declare rootName: string;

   constructor(config: ZoomIntoPropertyViewConfig) {
      super(config);
   }

   protected getBaseData(parentStoreData: any): any {
      let x = this.binding.value(parentStoreData);
      if (x != null && typeof x != "object") throw new Error("Zoomed value must be an object.");
      return {
         ...x,
      };
   }

   protected embedAugmentData(result: any, parentStoreData: any): void {
      result[this.rootName] = parentStoreData;
      super.embedAugmentData(result, parentStoreData);
   }

   setItem(path: string, value: any): boolean {
      if (path.indexOf(this.rootName + ".") == 0)
         return this.store.setItem(path.substring(this.rootName.length + 1), value);
      if (this.isExtraKey(Binding.get(path).parts[0])) return super.setItem(path, value);
      return super.setItem(this.binding.path + "." + path, value);
   }

   deleteItem(path: string): boolean {
      if (path.indexOf(this.rootName + ".") == 0)
         return this.store.deleteItem(path.substring(this.rootName.length + 1));
      if (this.isExtraKey(Binding.get(path).parts[0])) return super.deleteItem(path);
      return super.deleteItem(this.binding.path + "." + path);
   }
}

ZoomIntoPropertyView.prototype.rootName = "$root";
