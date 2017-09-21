import {View} from './View';
import {Binding} from './Binding';

export class ExposedRecordView extends View {

   getData() {
      if (this.cache.durable && this.meta.version === this.cache.version && this.cache.itemIndex === this.itemIndex)
         return this.cache.result;

      this.cache.result = this.embed(this.store.getData());
      this.cache.version = this.meta.version;
      this.cache.itemIndex = this.itemIndex;
      this.cache.durable = this.immutable || this.store.sealed;
      return this.cache.result;
   }

   embed(data) {
      var collection = this.collectionBinding.value(data);
      var record = collection[this.itemIndex];
      var copy = this.immutable || this.store.sealed ? {...data} : data;
      copy[this.recordName] = record;
      if (this.indexName)
         copy[this.indexName] = this.itemIndex;
      return copy;
   }

   setIndex(index) {
      this.itemIndex = index;
   }

   setItem(path, value) {
      if (path == this.recordName || path.indexOf(this.recordName + '.') == 0) {
         var storeData = this.store.getData();
         var collection = this.collectionBinding.value(storeData);
         var data = this.embed(storeData);
         var d = Binding.get(path).set(data, value);
         if (d === data)
            return false;
         var record = d[this.recordName];
         var newCollection = [...collection.slice(0, this.itemIndex), record, ...collection.slice(this.itemIndex + 1)]
         return this.store.setItem(this.collectionBinding.path, newCollection);
      }
      return this.store.setItem(path, value);
   }

   deleteItem(path) {
      var storeData, collection, newCollection;

      if (path == this.recordName) {
         storeData = this.store.getData();
         collection = this.collectionBinding.value(storeData);
         newCollection = [...collection.slice(0, this.itemIndex), ...collection.slice(this.itemIndex + 1)];
         return this.store.setItem(this.collectionBinding.path, newCollection);
      }
      else if (path.indexOf(this.recordName + '.') == 0) {
         storeData = this.store.getData();
         collection = this.collectionBinding.value(storeData);
         var data = this.embed(storeData);
         var d = Binding.get(path).delete(data);
         if (d === data)
            return false;
         var record = d[this.recordName];
         newCollection = [...collection.slice(0, this.itemIndex), record, ...collection.slice(this.itemIndex + 1)]
         return this.store.setItem(this.collectionBinding.path, newCollection);
      }

      return this.store.deleteItem(path);
   }
}

ExposedRecordView.prototype.immutable = false;