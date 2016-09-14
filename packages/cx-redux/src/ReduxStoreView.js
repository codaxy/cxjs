import {Binding} from 'cx-core/src/data/Binding';
import {View} from 'cx-core/src/data/View';
import {REPLACE_STATE} from './actions';

export class ReduxStoreView extends View {

   constructor(store) {
      super();
      this.store = store;
   }

   getData() {
      return this.store.getState();
   }

   set(path, value) {
      var oldData = this.getData();
      var newData = Binding.get(path).set(oldData, value);

      if (oldData !== newData)
         this.store.dispatch({
            type: REPLACE_STATE,
            state: newData
         })
   }

   delete(path) {
      var oldData = this.getData();
      var newData = Binding.get(path).delete(oldData);
      if (oldData !== newData) {
         this.store.dispatch({
            type: REPLACE_STATE,
            state: newData
         })
      }
   }

   clear() {
      this.store.dispatch({
         type: REPLACE_STATE,
         state: {}
      })
   }

   load(data) {
      var oldData = this.getData();
      var newData = oldData;

      for (var key in data)
         newData = Binding.get(key).set(newData, data[key]);

      if (oldData !== newData)
         this.store.dispatch({
            type: REPLACE_STATE,
            state: newData
         })
   }

   doNotify() {
      this.store.dispatch({
         type: REPLACE_STATE,
         state: this.getData()
      });
   }

   dispatch() {
      this.store.dispatch(...arguments);
   }

   subscribe() {
      return this.store.subscribe(...arguments);
   }
}

