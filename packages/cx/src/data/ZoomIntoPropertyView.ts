import { Binding } from "./Binding";
import { NestedDataView } from "./NestedDataView";

export class ZoomIntoPropertyView extends NestedDataView {
   binding?: Binding;
   rootName?: string;

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

   setItem(path: string, value: any): void {
      if (path.indexOf(this.rootName + ".") == 0) this.store.setItem(path.substring(this.rootName.length + 1), value);
      else if (this.isExtraKey(Binding.get(path).parts[0]))
         super.setItem(path, value);
      else super.setItem(this.binding.path + "." + path, value);
   }

   deleteItem(path: string): boolean {
      if (path.indexOf(this.rootName + ".") == 0) this.store.deleteItem(path.substring(this.rootName.length + 1));
      else if (this.isExtraKey(Binding.get(path).parts[0]))
         super.deleteItem(path);
      else super.deleteItem(this.binding.path + "." + path);
   }
}

ZoomIntoPropertyView.prototype.rootName = "$root";
