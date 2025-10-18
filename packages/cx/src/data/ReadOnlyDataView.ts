import { View } from "./View";

export class ReadOnlyDataView extends View {
   store: View;
   data?: any;
   immutable?: boolean;

   getData(): any {
      if (this.sealed && this.meta.version === this.cache.version && this.cache.data === this.data)
         return this.cache.result;

      let data = this.store.getData();
      this.cache.result =
         this.sealed || this.immutable || this.store.sealed
            ? Object.assign({}, data, this.getAdditionalData(data))
            : Object.assign(data, this.getAdditionalData(data));
      this.cache.version = this.meta.version;
      this.cache.data = this.data;
      return this.cache.result;
   }

   getAdditionalData(data?: any): any {
      return this.data;
   }

   setData(data: any): void {
      this.data = data;
   }
}

ReadOnlyDataView.prototype.immutable = false;
