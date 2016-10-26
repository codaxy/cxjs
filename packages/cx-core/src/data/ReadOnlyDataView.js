import {View} from './View';

export class ReadOnlyDataView extends View {

   getData() {
      if (!this.immutable || this.meta.version != this.cache.version || this.cache.data != this.data) {
         var data = this.store.getData();
         this.cache.result = this.immutable
            ? Object.assign({}, data, this.data)
            : Object.assign(data, this.data);
         this.cache.version = this.meta.version;
         this.cache.data = this.data;
      }
      return this.cache.result;
   }

   setData(data) {
      this.data = data;
   }
}

ReadOnlyDataView.prototype.immutable = false;