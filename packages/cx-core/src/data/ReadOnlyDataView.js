import {View} from './View';

export class ReadOnlyDataView extends View {

   constructor(store, data) {
      super();
      this.store = store;
      this.data = data;
   }

   getData() {
      var data = this.store.getData();
      return Object.assign({}, data, this.data);
   }

   setStore(store) {
      this.store = store;
   }

   setData(data) {
      this.data = data;
   }
}
