import { View, ViewConfig } from "./View";
import { Binding } from "./Binding";

export interface ExposedValueViewConfig extends ViewConfig {
   containerBinding: Binding;
   key?: string | null;
   recordName?: string;
}

export class ExposedValueView extends View {
   declare key: string;
   declare containerBinding: Binding;
   declare recordName: string;
   declare immutable?: boolean;
   declare store: View;

   constructor(config: ExposedValueViewConfig) {
      super(config);
   }

   getData(): any {
      if (
         this.sealed &&
         this.meta.version === this.cache.version &&
         this.cache.key === this.key &&
         this.meta == this.store.meta
      )
         return this.cache.result;

      let data = this.store.getData();
      let container = this.containerBinding.value(data) || {};
      let record = container[this.key];

      this.cache.version = this.meta.version;
      this.cache.key = this.key;
      this.cache.result = this.sealed || this.immutable || this.store.sealed ? { ...data } : data;
      this.cache.result[this.recordName] = record;
      this.meta = this.store.meta;
      return this.cache.result;
   }

   setKey(key: string) {
      this.key = key;
   }

   getKey() {
      return this.key;
   }

   setItem(path: string, value: any) {
      if (path == this.recordName || path.indexOf(this.recordName + ".") == 0) {
         var data = this.getData();
         var d = Binding.get(path).set(data, value);
         if (d === data) return false;
         var container = this.containerBinding.value(d);
         var record = d[this.recordName];
         var newContainer = Object.assign({}, container);
         newContainer[this.key] = record;
         return this.store.setItem(this.containerBinding.path, newContainer);
      }
      return this.store.setItem(path, value);
   }

   deleteItem(path: string) {
      var data, container, newContainer;

      if (path == this.recordName) {
         data = this.getData();
         container = this.containerBinding.value(data);
         if (!container || !container.hasOwnProperty(path)) return false;
         newContainer = Object.assign({}, container);
         delete newContainer[this.key];
         this.store.set(this.containerBinding.path, newContainer);
      } else if (path.indexOf(this.recordName + ".") == 0) {
         data = this.getData();
         var d = Binding.get(path).delete(data);
         if (d === data) return false;
         container = this.containerBinding.value(d);
         var record = d[this.recordName];
         newContainer = Object.assign({}, container);
         newContainer[this.key] = record;
         return this.store.setItem(this.containerBinding.path, newContainer);
      }

      return this.store.deleteItem(path);
   }
}

ExposedValueView.prototype.immutable = false;
