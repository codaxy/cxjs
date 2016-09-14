import {View} from './View';
import {Binding} from './Binding';

export class ExposedValueView extends View {

   constructor(store, containerBinding, key, recordPath) {
      super();
      this.store = store;
      this.containerBinding = containerBinding;
      this.key = key;
      this.recordPath = recordPath;
   }

   getData() {
      var data = this.store.getData();
      var container = this.containerBinding.value(data) || {};
      var record = container[this.key];
      data[this.recordPath] = record;
      return data;
   }

   setStore(store) {
      this.store = store;
   }

   setKey(key) {
      this.key = key;
   }

   getKey() {
      return this.key;
   }

   set(path, value) {
      if (path instanceof Binding)
         path = path.path;
      if (path == this.recordPath || path.indexOf(this.recordPath + '.') == 0) {
         var data = this.getData();
         var d = Binding.get(path).set(data, value);
         if (d != data) {
            var container = this.containerBinding.value(d);
            var record = d[this.recordPath];
            var newContainer = Object.assign({}, container);
            newContainer[this.key] = record;
            this.store.set(this.containerBinding, newContainer);
         }
      } else {
         this.store.set(path, value);
      }
   }

   delete(path) {
      if (path instanceof Binding)
         path = path.path;

      var data, container, newContainer;

      if (path == this.recordPath) {
         data = this.getData();
         container = this.containerBinding.value(data);
         if (!container.hasOwnProperty(path))
            return false;
         newContainer = Object.assign({}, container);
         delete newContainer[this.key];
         this.store.set(this.containerBinding, newContainer);
      }
      else if (path.indexOf(this.recordPath + '.') == 0) {
         data = this.getData();
         var d = Binding.get(path).delete(data);
         if (d != data) {
            container = this.containerBinding.value(d);
            var record = d[this.recordPath];
            newContainer = Object.assign({}, container);
            newContainer[this.key] = record;
            this.store.set(this.containerBinding, newContainer);
         }
      } else {
         this.store.delete(path);
      }
   }
}
