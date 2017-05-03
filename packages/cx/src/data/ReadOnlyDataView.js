import {View} from './View';

export class ReadOnlyDataView extends View {

   getData() {
      if (this.cache.durable && this.meta.version === this.cache.version && this.cache.data === this.data)
         return this.cache.result;

      let data = this.store.getData();
      this.cache.durable = this.immutable || this.store.sealed;
      this.cache.result = this.cache.durable
         ? Object.assign({}, data, this.data)
         : Object.assign(data, this.data);
      this.cache.version = this.meta.version;
      this.cache.data = this.data;
      return this.cache.result;
   }

   setData(data) {
      this.data = data;
   }
}

ReadOnlyDataView.prototype.immutable = false;