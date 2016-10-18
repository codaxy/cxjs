import {View} from './View';

export class ReadOnlyDataView extends View {
   getData() {
      var data = this.store.getData();
      if (this.immutable)
         return Object.assign({}, data, this.data);

      return Object.assign(data, this.data);
   }

   setStore(store) {
      this.store = store;
   }

   setData(data) {
      this.data = data;
   }
}

ReadOnlyDataView.prototype.immutable = false;