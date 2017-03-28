import {Binding, View} from 'cx/data';
import {CX_REPLACE_STATE} from './actions';

export class ReduxStoreView extends View {

   constructor(store) {
      super();
      this.store = store;
      this.meta = {
         version: 0
      }
   }

   getData() {
      return this.store.getState();
   }

   setItem(path, value) {
      let oldData = this.getData();
      let newData = Binding.get(path).set(oldData, value);

      if (oldData !== newData) {
         this.dispatch({
            type: CX_REPLACE_STATE,
            state: newData
         });
         return true;
      }

      return false;

   }

   deleteItem(path) {
      let oldData = this.getData();
      let newData = Binding.get(path).delete(oldData);
      if (oldData !== newData) {
         this.dispatch({
            type: CX_REPLACE_STATE,
            state: newData
         });
         return true;
      }
      return false;
   }

   clear() {
      this.dispatch({
         type: CX_REPLACE_STATE,
         state: {}
      })
   }

   load(data) {
      let oldData = this.getData();
      let newData = oldData;

      for (let key in data)
         newData = Binding.get(key).set(newData, data[key]);

      if (oldData !== newData)
         this.dispatch({
            type: CX_REPLACE_STATE,
            state: newData
         })
   }

   silently(callback) {
      this.notificationsSuspended = (this.notificationsSuspended || 0) + 1;
      let wasDirty = this.dirty, dirty;
      this.dirty = false;
      try {
         callback(this);
      }
      finally {
         this.notificationsSuspended--;
         dirty = this.dirty;
         this.dirty = wasDirty;
      }
      return dirty;
   }

   doNotify() {
      this.store.dispatch({
         type: CX_REPLACE_STATE,
         state: this.getData()
      });
   }

   dispatch(action) {
      if (typeof action == 'function')
         return action(::this.dispatch);

      this.store.dispatch(...arguments);
      this.meta.version++;
   }

   subscribe(callback) {
      return this.store.subscribe((...args) => {
         if (this.notificationsSuspended)
            this.dirty = true;
         else
            callback(...args);
      });
   }
}
