import {View} from './View';
import {Binding} from './Binding';

export class ExposedValueView extends View {

   getData() {
      var data = this.store.getData();
      if (this.storeData != data || !this.immutable) {
         var container = this.containerBinding.value(data) || {};
         var record = container[this.key];
         this.data = this.immutable ? {...data} : data;
         this.data[this.recordName] = record;
         this.storeData = data;
      }
      return this.data;
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
      if (path == this.recordName || path.indexOf(this.recordName + '.') == 0) {
         var data = this.getData();
         var d = Binding.get(path).set(data, value);
         if (d != data) {
            var container = this.containerBinding.value(d);
            var record = d[this.recordName];
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

      if (path == this.recordName) {
         data = this.getData();
         container = this.containerBinding.value(data);
         if (!container.hasOwnProperty(path))
            return false;
         newContainer = Object.assign({}, container);
         delete newContainer[this.key];
         this.store.set(this.containerBinding, newContainer);
      }
      else if (path.indexOf(this.recordName + '.') == 0) {
         data = this.getData();
         var d = Binding.get(path).delete(data);
         if (d != data) {
            container = this.containerBinding.value(d);
            var record = d[this.recordName];
            newContainer = Object.assign({}, container);
            newContainer[this.key] = record;
            this.store.set(this.containerBinding, newContainer);
         }
      } else {
         this.store.delete(path);
      }
   }
}

ExposedValueView.prototype.immutable = false;
